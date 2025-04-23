import dotenv from 'dotenv';
    dotenv.config({ path: '.env.local' });

import express from 'express';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import mapProductsData from './utils/mapProductsData.js';
import completeImageFilePath from './utils/completeImageFilePath.js';
import { registrationSchema } from './schema/registrationSchema.js';
import { loginSchema } from './schema/loginSchema.js';
import pg from 'pg';
import Redis from 'ioredis';
import generateRandomProfileColour from './utils/generateRandomProfileColour.js';

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = isProd ? process.env.POSTGRES_SERVER_PORT : 3001; // FIX LINE TO WORK ON PRODUCTION PORT

// connect to redis
const redis = new Redis(
    `rediss://default:${process.env.UPSTASH_REDIS_TOKEN}@${process.env.UPSTASH_REDIS_URL}:6379`
);

// initialise postgres
const { Pool } = pg;
const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_SERVER_IP,
    port: process.env.POSTGRES_SERVER_PORT,
    database: process.env.POSTGRES_DATABASE
});

if (isProd) {
    app.set('trust proxy', true);
};

console.log("CORS Origin loaded:", process.env.CORS_ORIGIN); // ? Add this
app.use(cors({
    origin: process.env.CORS_ORIGIN, // !! IMPORTANT! ALLOWS DATA TO MOVE BETWEEN FRONTEND AND BACKEND
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// allows images to be accessed by other websites
app.use('/images', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});    

export const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/images', express.static(path.join(__dirname, 'images')));

// MAKE FRONTEND OR BACKEND CHECK FOR SERVER RESPONSE. CRASH CURRENTLY OCCURS IF SERVER IS DOWN.
app.get('/', (req, res) => {
    res.send(`Server is online`)
})

// phones data
app.get('/phones', async (req, res) => {
    try {
        const queryResponse = await pool.query("SELECT * FROM products WHERE product_type = 'phone'");
        const hostURL = req.protocol + '://' + req.get('host');
        console.log(req.protocol)
        const productData = completeImageFilePath(queryResponse.rows, hostURL);
        res.send(productData);
    } catch (err) {
        return res.status(500).json({ 
            message: "Failed to fetch records from database" 
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
        console.log(err)
        return res.status(500).json({ 
            message: "Failed to fetch records from database" 
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

            const orderHistory = query.rows[0].order_history;
            
            res.send(orderHistory);
        } else {
            return res.status(401).json({
                message: "Invalid session token. Please log in and try again."
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error, please try again or contact website owner if the problem continues."
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
                const shoppingBasket = JSON.stringify({order: req.body});

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
        console.log(err)
        return res.status(500).json({
            message: "Error trying to process order. Please try logging in again, or contact the website owner if the problem continues."
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const parsedRequest = await loginSchema.safeParseAsync(req.body);
        
        if (!parsedRequest.success) { // returns error on invalid schema
            return res.status(400).json({
                message: parsedRequest.error.errors[0].message
            })
        }

        // check if user exists in database
        const queryResponse = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1::text", [req.body.email.toLowerCase()]);
        const userInDB = queryResponse.rows[0];

        if (userInDB) {
            const isPasswordCorrect = await bcrypt.compare(
                req.body.password,
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
                    email: req.body.email
                }));
                await redis.expire(newSessionToken, 43200); // 43200 seconds is 12 hours
                await pool.query('UPDATE users SET session_token=$1 WHERE email=$2',[newSessionToken, req.body.email]);

                const cookieExpiry = 1000 * 43200; // 12 hours in milliseconds
                // !!!!! VERIFY COOKIES ARE STILL SENT OVER IN PRODUCTION
                res.cookie('session_token', newSessionToken, { // secure cookie with session_token info
                    httpOnly: isProd ? true : false,
                    secure: isProd ? true : false,
                    sameSite: isProd ? 'None' : 'Lax',
                    maxAge: cookieExpiry
                })
                .cookie('userinfo', JSON.stringify({ // public user info cookie
                    email: userInDB.email,
                    name: userInDB.username,
                    profileColour: userInDB.profile_colour              
                }), {
                    httpOnly: false,
                    secure: isProd ? true : false,
                    sameSite: isProd ? 'None' : 'Lax',
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
        console.log(err)
        res.status(500).json({
            message: "Internal server error" 
        });
    };
})

app.post('/register', async (req, res) => {
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
        res.status(500).json({
            message: "Internal server error" 
        });
    };
})

app.post('/logout', async (req, res) => {
    const sessionToken = req.cookies.session_token;
    if (sessionToken) {
        try {
            await redis.del(sessionToken);
        } catch (err) {
            console.error('Error clearing session: ', err)
        };

        res.clearCookie('session_token', {
            httpOnly: isProd ? true : false,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
        });
        res.clearCookie('userinfo', {
            httpOnly: false,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
        });
    }


    res.status(200).json({
        message: "Logged out successfully"
    });
});


app.listen(3001, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
})
