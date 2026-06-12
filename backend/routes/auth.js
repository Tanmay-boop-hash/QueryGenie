import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool.js'; // Make sure the path to pool.js is correct!

const router = express.Router();

// --- REGISTER ---
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }

        // 1. Check if user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // 2. Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert the new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        // 4. Generate a JWT token
        const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ 
            success: true,
            token, 
            user: newUser.rows[0] 
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }

        // 1. Find the user by email
        const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" }); // Keep errors vague for security
        }

        const user = userQuery.rows[0];

        // 2. Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 3. Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 4. Send back the token and user info (excluding the password)
        res.json({ 
            success: true,
            token, 
            user: { id: user.id, email: user.email } 
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});

export default router;