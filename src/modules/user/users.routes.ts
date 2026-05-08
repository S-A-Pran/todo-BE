import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import userController from "./users.controller";
const router = express.Router();

router.post("/", userController.userCreateController);
router.put("/:id", userController.userUpdateController);
router.delete("/:id", userController.userDeleteController);
router.get("/", authMiddleware("admin"), userController.userListController);

export const userRouter = router;
