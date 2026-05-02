import { Request, Response } from "express";
import userServices from "../services/users.service";

const userCreateController = async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await userServices.userCreateService({
      name,
      email,
      age,
      phone,
      address,
    });

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
};

const userUpdateController = async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await userServices.userUpdateService({
      name,
      email,
      age,
      phone,
      address,
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
        message: "User not found!",
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

const userDeleteController = async (req: Request, res: Response) => {
  try {
    const result = await userServices.userDeleteService(String(req.params.id));
    if (result.rowCount) {
      res.status(200).json({
        success: true,
        message: "Deleted successfully!",
        count: result.rowCount,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found!",
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

const userListController = async (req: Request, res: Response) => {
  try {
    const result = await userServices.userListService();

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
};

const userController = {
  userCreateController,
  userUpdateController,
  userDeleteController,
  userListController,
};

export default userController;
