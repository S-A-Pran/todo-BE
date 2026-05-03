import express from "express";
import todosController from "../controllers/todos.controller";
import logger from "../middlewares/logger";
const router = express.Router();

router.post("/", logger, todosController.todosCreateController);
router.put("/:id", todosController.todosUpdateController);
router.delete("/:id", todosController.todosDeleteController);
router.get("/", todosController.todosListController);

export const todosRouter = router;
