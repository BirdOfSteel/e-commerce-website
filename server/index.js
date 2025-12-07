import express from 'express';
import https from 'https';
import fs from 'fs';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import pg from 'pg';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import completeImageFilePath from './utils/completeImageFilePath.js';
import { registrationSchema } from './schema/registrationSchema.js';
import { loginSchema } from './schema/loginSchema.js';
import generateRandomProfileColour from './utils/generateRandomProfileColour.js';

const isProd = process.env.NODE_ENV === 'production';

// determine .env file
dotenv.config({ path: isProd ? '.env.production' : '.env.development' });

const port = isProd ? process.env.PROD_SERVER_PORT : process.env.DEV_SERVER_PORT;
console.log(process.env.DEV_SERVER_PORT)

// custom __dirname
export const __dirname = dirname(fileURLToPath(import.meta.url));

// add express
const app = express();

// add favicon
app.use(favicon(path.join(__dirname, 'images', 'favicon', 'favicon.ico')))

// connect to redis
const redis = new Redis(
    `rediss://default:${process.env.UPSTASH_REDIS_TOKEN}@${process.env.UPSTASH_REDIS_URL}:6379`
);

// sets http response headers
app.use(helmet());

// configure cors
app.use(cors({
    origin: isProd ? process.env.PROD_CORS_ORIGIN : process.env.DEV_CORS_ORIGIN,
    credentials: true
}));

app.use(express.json()); // parse incoming json
app.use(cookieParser()); // easy cookies in expressJS

// allows images to be requested by other websites
app.use('/images', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});  

// static /images path
app.use('/images', express.static(path.join(__dirname, 'images'), {
    maxAge: '1d', // cache images for 1 day
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'public, max-age=86400'); // cache for 1 day
    }
}));

// initialise postgres
const { Pool } = pg;
const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST_IP,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB_NAME
});

console.log("Environment: " + process.env.NODE_ENV);
console.log("Accepting requests from:", 
    isProd ? process.env.PROD_CORS_ORIGIN : process.env.DEV_CORS_ORIGIN
);

app.get('/', (req, res) => {
    res.send("Server is online")
});

// phones data
app.get('/phones', async (req, res) => {
    try {
        const queryResponse = await pool.query("SELECT * FROM products WHERE product_type = 'phone'");
        const hostURL = req.protocol + '://' + req.get('host'); // MAKE CONDITIONAL ON HTTP/HTTPS
        const productData = completeImageFilePath(queryResponse.rows, hostURL);
        res.send(productData);
    } catch (err) {
        console.log(`Error in /phones : ${err.stack || err}`);
        return res.status(500).json({ 
            message: "Internal server error while trying to fetch records from database. Please try again later." 
        });
    }
})


// tablets data
app.get('/tablets', async (req, res) => {
    try {
        const queryResponse = await pool.query("SELECT * FROM products WHERE product_type = 'tablet'");
        const hostURL = req.protocol + '://' + req.get('host');
        const productData = completeImageFilePath(queryResponse.rows, hostURL);
        
        res.send(productData);
    } catch (err) {
        console.log(`Error in /tablets : ${err.stack || err}`);
        return res.status(500).json({ 
            message: "Internal server error while trying to fetch records from database. Please try again later." 
        });
    }
})

app.get('/get-order-history', async (req, res) => {
    try {
        const userinfoCookie = req.cookies.userinfo;
        
        if (userinfoCookie) {
            const email = JSON.parse(userinfoCookie).email;

            const query = await pool.query(`
                SELECT order_history 
                FROM orders 
                WHERE email = $1`,
                [email]
            );

            const orderHistory = query.rows[0].order_history ?? null;

            res.send(orderHistory);
        } else {
            console.log(`Error in /get-order-history : ${err.stack || err}`);
            return res.status(401).json({
                message: "Invalid session token. Please log in and try again."
            })
        }
    } catch (err) {
        console.log(`Error in /get-order-history : ${err.stack || err}`);
        return res.status(500).json({
            message: "Internal server error while fetching order history. Please try again later."
        })
    }
});

app.post('/add-to-order-history', async (req, res) => {
    try {
        const sessionToken = req.cookies.session_token;
        const isSessionValid = await redis.get(sessionToken); // checks session exists
        
        if (isSessionValid) { // finish query after veryifying data structure of basket
            if (req.body.shoppingBasket && req.cookies.userinfo && req.body.shoppingBasket.length > 0) {
                const email = JSON.parse(req.cookies.userinfo).email;
                const shoppingBasket = JSON.stringify(req.body);

                await pool.query(`
                    INSERT INTO orders(email, order_history)
                    VALUES($1, '[]'::jsonb)
                    ON CONFLICT (email) DO NOTHING`,
                    [email]
                ); // adds email to 'orders' table, unless it exists

                await pool.query(`
                    UPDATE orders 
                    SET order_history = COALESCE(order_history, '[]'::jsonb) || $1::jsonb 
                    WHERE email = $2`,
                    [shoppingBasket, email]
                ); // adds order to 'orders' table under email

                return res.status(200).json({
                    message: "Session verified. Processing payment..."
                });
            } else {
                return res.status(400).json({
                    message: "Basket is empty or invalid. Please add items and try again, or contact website owner if this continues."
                });
            }
        } else {
            return res.status(401).json({
                message: "Invalid or expired session. Please log in again."
            });
        }  
    } catch (err) {
        console.log(`Error in /add-to-order-history : ${err.stack || err}`);
        return res.status(500).json({
            message: "Internal server error while trying to process order. Please try again later." 
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const parsedRequest = await loginSchema.safeParseAsync(req.body.loginForm);
        
        if (!parsedRequest.success) { // returns error on invalid schema
            return res.status(400).json({
                message: parsedRequest.error.errors[0].message
            })
        };
        const email = req.body.loginForm.email;
        const password = req.body.loginForm.password;

        // check if user exists in database
        const queryResponse = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1::text", [email.toLowerCase()]);
        const userInDB = queryResponse.rows[0];

        if (userInDB) {
            const isPasswordCorrect = await bcrypt.compare(
                password,
                queryResponse.rows[0].password_hash
            );

            if (isPasswordCorrect) { // log-in successful
                const sessionToken = req.cookies.session_token;
                const isSessionValid = await redis.get(sessionToken);

                if (isSessionValid) { // if user logs in while holding a valid session token, it's removed from redis
                    await redis.del(sessionToken);
                }
                    
                let newSessionToken = uuidv4();

                await redis.set(newSessionToken, JSON.stringify({
                    email: email
                }));
                await redis.expire(newSessionToken, 43200); // 43200 seconds is 12 hours
                await pool.query('UPDATE users SET session_token=$1 WHERE email=$2',[newSessionToken, email]);

                const cookieExpiry = 1000 * 43200; // 12 hours in milliseconds

                res.cookie('session_token', newSessionToken, { // secure cookie with session_token info
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: cookieExpiry
                })
                .cookie('userinfo', JSON.stringify({ // user info cookie
                    email: userInDB.email,
                    name: userInDB.username,
                    profileColour: userInDB.profile_colour              
                }), {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'None',
                    maxAge: cookieExpiry
                })
                .status(200).json({
                    message: 'Success! Logging in...'
                })
            } else { // invalid password
                return res.status(401).json({
                    message: "Invalid credentials. Check email and password."
                })
            }
        } else { // no account with this email exists
            return res.status(401).json({
                message: "Invalid credentials. Check email and password."
            });
        };

    } catch (err) {
        console.log(`Error in /login : ${err.stack || err}`);
        res.status(500).json({
            message: "Internal server error" 
        });
    };
})

app.post('/register', async (req, res) => { // UPDATE TO USE req.body.loginForm OBJECT
    try {
        const parsedRequest = await registrationSchema.safeParseAsync(req.body);
        
        if (!parsedRequest.success) { // if user inputs don't follow schema, sends error message
            return res.status(400).json({
                message: parsedRequest.error.errors[0].message
            });
        };
        
        const queryResponse = await pool.query('SELECT email,password_hash FROM users WHERE LOWER(email) = $1::text',[req.body.email.toLowerCase()]); // checks if email is already in database
        const emailInDB = queryResponse.rows[0];

        if (emailInDB) {
            return res.status(400).json({
                message: "Account with this email already exists"
            });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
            const profileColour = generateRandomProfileColour();
            
            await pool.query(`
                INSERT INTO users(email, username, password_hash, profile_colour)
                VALUES($1,$2,$3,$4)`, 
                [req.body.email, req.body.name, hashedPassword, profileColour]
            ); // add user to users database

            await pool.query(`
                INSERT INTO orders(email, order_history)
                VALUES($1, '[]'::jsonb)
                ON CONFLICT (email) DO NOTHING`,
                [req.body.email]
            ); // adds email to 'orders' table, unless it exists    

            return res.status(200).json({
                message: "Account created!"
            });
        }
    } catch (err) { // server error
        console.log(`Error in /register : ${err.stack || err}`);
        res.status(500).json({
            message: "Internal server error while trying to register. Please try again later." 
        });
    };
})

app.post('/logout', async (req, res) => {
    const sessionToken = req.cookies.session_token;
    if (sessionToken) {
        try {
            await redis.del(sessionToken);
        } catch (err) {
            console.log('Error clearing session in /logout: ', err)
        };

        res.clearCookie('session_token', {
            httpOnly: isProd ? true : false,
            secure: true,
            sameSite: 'None',
        });
        res.clearCookie('userinfo', {
            httpOnly: false,
            secure: true,
            sameSite: 'None',
        });
    }

    res.status(200).json({
        message: "Logged out successfully"
    });
});



if (isProd) { // trust proxies like cloudflare in production environment
    app.set('trust proxy', true);
}

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../certs/localhost+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../certs/localhost+2.pem'))
}, app)

server.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// graceful shutdown on SIGINT (Ctrl + C)
process.on('SIGINT', async () => {
    console.log('Running graceful shutdown procedure.');

    // closing connections and server
    server.close(async () => {
        try {
            await redis.quit(); // disconnect redis
            console.log('Redis connection closed');
        } catch (err) {
            console.log('Error closing Redis connection: ', err);
        }

        try {
            await pool.end(); // close postgresql connection pool
            console.log('PostgreSQL connections closed.');
        } catch (err) {
            console.log('Error closing PostgreSQL connections: ', err);
        }

        console.log('Executed shutdown.');
        process.exit(0); // Exit after cleanup
    });

    // if server takes too long to stop, forcefully exit after timeout
    setTimeout(() => {
        console.log('Error: graceful shutdowm taking too long - forcefully shutting down.');
        process.exit(1);
    }, 10000); // increase timer if more time is needed to close connections
});
