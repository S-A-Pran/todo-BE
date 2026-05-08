import express from "express";
import logger from "../../middlewares/logger";
import todosController from "./todos.controller";
const router = express.Router();

router.post("/", logger, todosController.todosCreateController);
router.put("/:id", todosController.todosUpdateController);
router.delete("/:id", todosController.todosDeleteController);
router.get("/", todosController.todosListController);

export const todosRouter = router;
