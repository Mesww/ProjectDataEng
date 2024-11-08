import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;

const MONGOURL = process.env.MONGOURL || 'mongodb://admin:admin@localhost:27017';

// Middleware to parse JSON
app.use(express.json());
console.log('MONGOURL:', MONGOURL);
// Connect to MongoDB
mongoose.connect(MONGOURL).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Express with MongoDB!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});