import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './configs/db';
import bookRoute from './routes/book.route';
import borrowerRoute from './routes/borrower.route';
import transactionRoute from './routes/transaction.route';
import logMiddleware from './middlewares/log';
const cors = require('cors');
dotenv.config();
const app = express();
const port = 3000;


app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware to parse JSON
app.use(express.json());
app.use(logMiddleware);  

connectDB();
// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Express with MongoDB!');
});
app.use('/books', bookRoute);
app.use('/borrowers', borrowerRoute);
app.use('/transactions', transactionRoute);
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});