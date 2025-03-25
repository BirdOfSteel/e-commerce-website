import dotenv from 'dotenv';
    dotenv.config({ path: '.env.local' });

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bcrypt from 'bcrypt';
import Airtable from 'airtable';
import mapProductsData from './utils/mapProductsData.js';
import { registrationSchema } from './schema/registration.js';
import { loginSchema } from './schema/login.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);


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
            
        const filteredRecords = await base('users').select({
            filterByFormula: `{email} = "${req.body.email}"`
        }).firstPage();
    
        const accountMatchingEmail = filteredRecords[0]?.fields ?? null;
    
        const isPasswordMatching = accountMatchingEmail ? 
            await bcrypt.compare(req.body.password, accountMatchingEmail['hashed-password'])
            : false;
      
        if (accountMatchingEmail && isPasswordMatching) {
            return res.status(200).json({
                message: 'Success! Logging in...'
            })
        } else {
            return res.status(401).json({
                message: 'Invalid credentials. Please check email and password.'
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
        
        if (!parsedRequest.success) { // returns error on invalid schema

            return res.status(400).json({
                message: parsedRequest.error.errors[0].message
            })
        }

        let matchingEmail = false;
        // USE FILTERBYFORMULA WITHIN SELECT!!!!
        base('users').select().eachPage( // goes through all AirTable pages
            (records, fetchNextPage) => {
                records.forEach((record) => {
                    if (req.body.email === record.fields.email) {
                        matchingEmail = true;
                        return;
                    }
                })
                
            if (matchingEmail) { // if email found in database, prevents fetchNextPage() from running
                return res.status(400).json({
                    message: 'Account with this email already exists'
                }) 
            }
            fetchNextPage();
        }, async (err) => {
            if (err) {
                console.error(`Error fetching records: ${err}`);
                return
            } else { // successful account creation
            
                try { // hashing occurs here
                    const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
                    base('users').create({
                        email: req.body.email,
                        name: req.body.name,
                        'hashed-password': hashedPassword
                    })
    
                    return res.status(200).json({
                        message: 'Account successfully created'
                    })
                } catch (err) { // hashing/server error 
                    return res.status(500).json({
                        message: 'Server error, please try again. Contact website admin/owner if this keeps happening.'
                    })
                }
            } 
        });


    } catch (err) { // server error
        res.status(500).json({
            message: "Internal server error" 
        })
    }
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
