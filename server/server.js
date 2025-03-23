import dotenv from 'dotenv';
    dotenv.config({ path: '.env.local' });

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import Airtable from 'airtable';
import mapProductsData from './utils/mapProductsData.js';
import { registrationSchema } from './schema/registration.js';

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
        res.status(500).json({ error: "Failed to fetch records from Airtable" })
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
        console.log(err)
        res.status(500).json({ error: "Failed to fetch records from Airtable" })
    }

    res.end();
})


app.post('/register', async (req, res) => {

    try {
        const result = await registrationSchema.safeParseAsync(req.body)
        
        if (!result.success) { // returns error on invalid schema

            return res.status(400).json({
                error: result.error.errors[0]
            })
        }

        let matchingEmail = false;

        base('users').select().eachPage(
            (records, fetchNextPage) => {
                records.forEach((x) => {
                    if (req.body.email === x.fields.email) {
                        matchingEmail = true;
                        return;
                    }
                })
            if (matchingEmail) return; // if email in database, prevents fetchNextPage() from running
            fetchNextPage();
        }, (err) => {
            if (err) {
                console.error(`Error fetching records: ${err}`);
                return
            }

            if (matchingEmail) { // email already in database, return status 400
                return res.status(400).json({
                    message: 'Account with this email already exists'
                })
            } else {
                base('users').create({
                    email: req.body.email,
                    name: req.body.name,
                    passhash: req.body.password
                })

                return res.status(200).json({
                    message: 'Success'
                })
            } 
        });


    } catch (err) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
