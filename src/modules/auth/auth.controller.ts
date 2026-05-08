import { Request, Response } from "express";
import authService from "./auth.service";
const loginController = async (req: Request, res: Response) => {
  const result = await authService.loginService(req.body);

  if (result === undefined) {
    res.status(404).json({
      success: false,
      message: "User not found with the provided email!",
      data: null,
    });
  } else if (result === null) {
    res.status(401).json({
      success: false,
      message: "Password not matched!",
      data: null,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Login Successful!",
      data: result,
    });
  }
};

const authController = {
  loginController,
};

export default authController;
