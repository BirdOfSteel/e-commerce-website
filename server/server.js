import dotenv from 'dotenv';
    dotenv.config({ path: '.env.local' });

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bcrypt from 'bcrypt';
import Airtable from 'airtable';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import mapProductsData from './utils/mapProductsData.js';
import { registrationSchema } from './schema/registration.js';
import { loginSchema } from './schema/login.js';
import { record } from 'zod';

const app = express();
const port = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', // !! IMPORTANT! CONTROLS WHERE COOKIES CAN BE SENT! 
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);


// MAKE FRONTEND OR BACKEND CHECK FOR SERVER RESPONSE. CRASH CURRENTLY OCCURS IF SERVER IS DOWN.

app.get('/', (req, res) => {
    res.send(`API is online`)
})


// phones data
app.get('/phones', async (req, res) => {
    
    try {
        const response = await base('phones').select().firstPage();
        const productArray = mapProductsData(response);
        res.send(productArray)
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch records from Airtable" 
        })
    }

    res.end();
})


// tablets data
app.get('/tablets', async (req, res) => {
    try {
        const response = await base('tablets').select().firstPage();
        const productArray = mapProductsData(response);
        res.send(productArray)
    } catch (err) {
        return res.status(500).json({ 
            message: "Failed to fetch records from Airtable" 
        })
    }

    res.end();
})


app.post('/login', async (req, res) => {
    try {
        const parsedRequest = await loginSchema.safeParseAsync(req.body);
    
        if (!parsedRequest.success) { // returns error on invalid schema
            return res.status(400).json({
                message: parsedRequest.error.errors[0].message
            })
        }

        const matchingUser = await base('users').select({
            filterByFormula: `LOWER({email}) = '${req.body.email}'` // looks for account in database with given email
        }).all();
        
        if (matchingUser[0]) {
            const isPasswordCorrect = await bcrypt.compare(
                req.body.password, 
                matchingUser[0].fields['hashed-password']
            );

            if (isPasswordCorrect) { // log-in successful
                // install number generator
                let tokenValue = uuidv4();
                let recordId = matchingUser[0].id;

                await base('users').update(recordId ,{
                    'access-token': `${tokenValue}`
                })

                // !!!!! VERIFY COOKIES ARE STILL SENT OVER IN PRODUCTION
                res.cookie('token', tokenValue, { // secure cookie with token info
                    httpOnly: isProd ? true : false,
                    secure: isProd ? true : false,
                    sameSite: isProd ? 'None' : 'Lax',
                    maxAge: 1000 * 60 * 60 * 24
                })
                .cookie('userinfo', JSON.stringify({ // public user info cookie
                    email: matchingUser[0].fields.email,
                    name: matchingUser[0].fields.name
                }), {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'Lax',
                    maxAge: 1000 * 60 * 60 * 24
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
            }) 
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error" 
        })
    }
})


app.post('/register', async (req, res) => {
    try {
        const parsedRequest = await registrationSchema.safeParseAsync(req.body)
        
        if (!parsedRequest.success) { // if user inputs don't follow schema, sends error message
            return res.status(400).json({
                message: parsedRequest.error.errors[0].message
            })
        }

        const matchingUser = await base('users').select({
            filterByFormula: `LOWER({email}) = '${req.body.email}'` // looks for account in database with given email
        }).all();

        if (matchingUser[0]) { 
            return res.status(400).json({
                message: "Account with this email already exists"
            })
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

            await base('users').create({
                email: req.body.email,
                name: req.body.name,
                'hashed-password': hashedPassword
            })

            return res.status(200).json({
                message: "Account created!"
            })
        }
    } catch (err) { // server error
        res.status(500).json({
            message: "Internal server error" 
        })
    }
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
