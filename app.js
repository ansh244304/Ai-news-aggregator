const express = require('express');
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');


app.use(express.json());
connectDB();


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}
);


app.get('/', (req, res) => {
    res.send('Welcome to the Newsmania API');
})

app.use('/api', authRoutes);