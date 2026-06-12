import express from "express";
import pool from '../db/pool.js'; // <-- Import the database pool to fetch schema information
import authenticateToken from '../middleware/auth.js'; // <-- Import the authentication middleware

const router = express.Router();

// --- POST: Save a new schema ---
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, schema_text } = req.body;

        if (!name || !schema_text) {
            return res.status(400).json({ error: "Please provide both name and schema_text" });
        }

        const newSchema = await pool.query(
            'INSERT INTO saved_schemas (user_id, name, schema_text) VALUES ($1, $2, $3) RETURNING id, name, created_at',
            [req.user.userId, name, schema_text]
        );

        res.status(201).json({ 
            success: true, 
            schema: newSchema.rows[0],
            message: "Schema saved successfully!"
        });

    } catch (error) {
        console.error("Error saving schema:", error);
        res.status(500).json({ error: "Failed to save schema" });
    }
});

// --- GET: Fetch all schemas for the user ---
router.get('/', authenticateToken, async (req, res) => {
    try {
        const schemas = await pool.query(
            'SELECT id, name, schema_text, created_at FROM saved_schemas WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.userId]
        );

        res.json({ success: true, schemas: schemas.rows });
    } catch (error) {
        console.error("Error fetching schemas:", error);
        res.status(500).json({ error: "Failed to fetch schemas" });
    }
});

export default router;