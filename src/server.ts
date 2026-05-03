import express, { Request, Response } from "express";

import config from "./config";
import initDB from "./config/db";
import { todosRouter } from "./routes/todos.routes";
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
app.use("/todos", todosRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: "Route not found!",
    path: req.path,
  });
});
