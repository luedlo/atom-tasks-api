import { Router } from 'express';
import TasksController from '../controllers/tasks.controller';

const router = Router();

router.post('/', TasksController.createTask);
router.get('/', TasksController.getAllTasks);
router.get('/:id', TasksController.getTask);
router.put('/:id', TasksController.updateTask);
router.delete('/:id', TasksController.deleteTask);

export default router;