import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";

const app: Application = express();
const pool = new Pool({ connectionString: config.connection_string });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            age INT,
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

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to express server!");
});
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
        SELECT * FROM users
    `);
    if (result.rowCount) throw new Error("User not found!");
    res.status(201).json({
      success: true,
      message: "Users is found!",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
});
app.get("/api/user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT * FROM users
        WHERE id::TEXT = $1 OR email = $1;
      `,
      [id],
    );
    if (result.rowCount) throw new Error("User not found!");
    res.status(200).json({
      success: true,
      message: "User is found!",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
});
app.post("/api/user", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    const result = await pool.query(
      `
        INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4)
        `,
      [name, email, password, age],
    );
    res.status(201).json({
      success: true,
      message: "User is created!",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
});
app.put("/api/user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, is_active, age } = req.body;

    const result = await pool.query(
      `
        UPDATE users 
        SET
        name = COALESCE($1, name),  
        password = COALESCE($2, password),
        age = COALESCE($3, age),
        is_active = COALESCE($4, is_Active),
        updated_at = NOW()
        WHERE id::TEXT = $5 OR email = $5
        RETURNING *
      `,
      [name ?? null, password ?? null, age ?? null, is_active ?? null, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
});
app.delete("/api/user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        DELETE FROM users
        WHERE id::TEXT = $1 OR email = $1
        RETURNING *;
      `,
      [id],
    );
    if (!result.rowCount) throw new Error("User not found!");
    res.status(200).json({
      success: true,
      message: "User is deleted!",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
});
app.listen(config.port, () =>
  console.log(`The express server is running on PORT: ${config.port}`),
);
