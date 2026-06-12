import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import queryRoutes from './routes/query.js';
import authRoutes from './routes/auth.js'; 
import schemaRoutes from './routes/schemas.js'; 

dotenv.config();
const app = express();

// Configure CORS to accept requests ONLY from our Vite frontend
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Crucial for Bearer tokens!
}));

app.use(express.json()); // This allows express to parse JSON bodies sent in requests

const PORT  = process.env.PORT || 5001;

// Mount the query routes under the /api path
app.use('/api/query', queryRoutes); // <-- This means all routes defined in queryRoutes will be prefixed with /api, e.g., /api/query

app.use('/api/auth', authRoutes); // <-- Mount the auth routes under the /api path as well
app.use('/api/schemas', schemaRoutes); // <-- Mount the schema routes under the /api path as well

app.get('/', (req, res) => {
    res.json({message: 'QueryGenie Backend is running!'});
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})