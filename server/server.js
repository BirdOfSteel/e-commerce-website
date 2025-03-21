import dotenv from 'dotenv';
    dotenv.config({ path: '.env.local' });

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import Airtable from 'airtable';
import mapProductsData from './utils/mapProductsData.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

app.get('/', (req, res) => {
    console.log(base)
    res.send(`API is online`)
})

app.get('/phones', async (req, res) => {
    
    try {
        const response = await base('phones').select().firstPage();
        const productArray = mapProductsData(response);
        console.log(productArray)
        res.send(productArray)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch records from Airtable" })
    }

    res.end();
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

// make .get reply with api data