import { Request, Response } from "express";
import todosServices from "../services/todos.service";

const todosCreateController = async (req: Request, res: Response) => {
  const { user_id, title, description, completed, due_date } = req.body;
  try {
    const result = await todosServices.todosCreateService({
      user_id,
      title,
      description,
      completed,
      due_date,
    });

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
};

const todosUpdateController = async (req: Request, res: Response) => {
  const { user_id, title, description, completed, due_date } = req.body;

  try {
    const result = await todosServices.todosUpdateService({
      user_id,
      title,
      description,
      completed,
      due_date,
      id: String(req.params.id),
    });

    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: "Updated successfully!",
        count: result.rowCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Todos not found!",
        data: null,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const todosDeleteController = async (req: Request, res: Response) => {
  try {
    const result = await todosServices.todosDeleteServices(
      String(req.params.id),
    );
    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: "Deleted successfully!",
        count: result.rowCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Todos not found!",
        data: null,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const todosListController = async (req: Request, res: Response) => {
  try {
    const result = await todosServices.todosListServices();

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
};

const todosController = {
  todosCreateController,
  todosUpdateController,
  todosDeleteController,
  todosListController,
};

export default todosController;
