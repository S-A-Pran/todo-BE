import express, { Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middlewares/logger";
import { userRouter } from "./routes/users.routes";
const port = config.port;
const app = express();
app.use(express.json());

initDB();

app.listen(port, () => {
  console.log("Listening at port..", port);
});

//users routes
app.use("/users", userRouter);

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
