import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({ connectionString: config.connection_string });

export const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            age INT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS profiles(
            id SERIAL PRIMARY KEY,
            userId INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            -- one-to-one relationship
            bio TEXT,
            address TEXT,
            phone VARCHAR(15),
            links TEXT[] DEFAULT '{}',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log("Datebase is connected!");
  } catch (err) {
    console.error(err);
  }
};