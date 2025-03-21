import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send(`API is online`)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

// make .get reply with api data