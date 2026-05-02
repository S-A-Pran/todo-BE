import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { Pool } from "pg";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const port = process.env.PORT;
const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STRING}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);
};

initDB();

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  console.log(`${new Date().toLocaleString()} ${req.body} ${res.status}`);
  next();
};

app.listen(port, () => {
  console.log("Listening at port..", port);
});

//users crud
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, age, phone, address) values($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, age, phone, address],
    );

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const data = await pool.query(`SELECT * FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (data) {
      const result = await pool.query(
        `UPDATE users SET name=$1, email=$2, age=$3, phone=$4, address=$5 WHERE id=$6`,
        [name, email, age, phone, address, req.params.id],
      );

      res.status(200).json({
        success: true,
        message: "Updated successfully!",
        count: result.rowCount,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const data = await pool.query(`SELECT * FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (data) {
      const result = await pool.query(`DELETE FROM users WHERE id=$1`, [
        req.params.id,
      ]);

      res.status(200).json({
        success: true,
        message: "Deleted successfully!",
        count: result.rowCount,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: "List of all users",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

//todos crud
app.post("/todos", logger, async (req: Request, res: Response) => {
  const { user_id, title, description, completed, due_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title, description, completed, due_date) values($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, title, description, completed, due_date],
    );

    res.status(201).json({
      success: true,
      message: "Todos created successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { user_id, title, description, completed, due_date } = req.body;

  try {
    const data = await pool.query(`SELECT * FROM todos WHERE id=$1`, [
      req.params.id,
    ]);

    if (data) {
      const result = await pool.query(
        `UPDATE todos SET user_id=$1, title=$2, description=$3, completed=$4, due_date=$5 WHERE id=$6`,
        [user_id, title, description, completed, due_date, req.params.id],
      );

      res.status(200).json({
        success: true,
        message: "Updated successfully!",
        count: result.rowCount,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const data = await pool.query(`SELECT * FROM todos WHERE id=$1`, [
      req.params.id,
    ]);

    if (data) {
      const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [
        req.params.id,
      ]);

      res.status(200).json({
        success: true,
        message: "Deleted successfully!",
        count: result.rowCount,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: "List of all todos",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: "Route not found!",
    path: req.path,
  });
});
