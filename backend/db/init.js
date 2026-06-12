import pool from './pool.js';

// We're creating three tables structured to handle multiple users, schema definitions, and an audit trail of past queries.

const createTables =  async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS saved_schemas (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      schema_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS query_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      user_text TEXT NOT NULL,
      generated_sql TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try {
        console.log("Creating database tables...");
        await pool.query(queryText);
        console.log("All tables created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error creating tables:", error);
        process.exit(1);
    }
};

createTables();