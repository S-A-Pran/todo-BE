import express from "express";
import userController from "../controllers/users.controller";
const router = express.Router();

router.post("/", userController.userCreateController);
router.put("/:id", userController.userUpdateController);
router.delete("/:id", userController.userDeleteController);
router.get("/", userController.userListController);

export const userRouter = router;
