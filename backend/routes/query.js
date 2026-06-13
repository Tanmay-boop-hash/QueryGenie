import express from 'express';
import { GoogleGenAI } from '@google/genai';
import pool from '../db/pool.js'; 
import authenticateToken from '../middleware/auth.js'; 

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user_text, schema_context } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert SQL generator.
      Database Schema:
      ${schema_context || "No schema provided"}

      User Question:
      ${user_text}

      Task: Write the PostgreSQL query to answer the user's question.
      Return EXACTLY the raw SQL query. Do not include markdown formatting, backticks, or any conversational text.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    let generatedSql = result.text.trim();

    // Clean up markdown formatting if Gemini accidentally includes it
    if (generatedSql.startsWith('```sql')) {
      generatedSql = generatedSql.replace(/^```sql\n/, '').replace(/\n```$/, '');
    } else if (generatedSql.startsWith('```')) {
      generatedSql = generatedSql.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const currentUserId = req.user.id || req.user.userId;

    if (!currentUserId) {
      console.error("Token payload:", req.user);
      return res.status(401).json({ error: "User identity could not be verified from token." });
    }

    // Save strictly the SQL to the history database
    const newHistory = await pool.query(
      'INSERT INTO query_history (user_id, user_text, generated_sql) VALUES ($1, $2, $3) RETURNING *',
      [currentUserId, user_text, generatedSql]
    );

    res.json({ 
      history: newHistory.rows[0], 
      sql: generatedSql
    });

  } catch (error) {
    console.error("Error generating SQL:", error);
    res.status(500).json({ error: "Failed to generate SQL" });
  }
});

// --- GET: Fetch user's query history ---
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user.userId;
    
    const history = await pool.query(
      'SELECT * FROM query_history WHERE user_id = $1 ORDER BY created_at DESC',
      [currentUserId]
    );
    
    res.json(history.rows);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;