import { Request, Response } from 'express';
import {
  createNewTask,
  getTaskById,
  getAllTasksForUser,
  getTasksByCompletionStatusForUser,
  updateTaskFields,
  deleteTask
} from '../services/task.service';
import { Task } from '../models/task.model';

class TasksController {

  /**
   * Create a new task for the authenticated user.
   * POST /api/tasks
   * Protected route. Requires JWT.
   */
  public async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, completed, dueDate } = req.body;
      const userId = req.userId as string;

      if (!title || completed === undefined || !userId) {
        res.status(400).json({ message: 'Title, completion status, and user ID are required.' });
        return;
      }

      const newTaskData: Omit<Task, 'id' | 'createdAt'> = {
        title,
        description,
        completed: Boolean(completed),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        userId
      };

      const newTaskId = await createNewTask(newTaskData);
      res.status(201).json({ id: newTaskId, message: 'Task created successfully.' });
    } catch (error: any) {
      console.error('Error in createTask:', error);
      res.status(500).json({ message: 'Failed to create task.', error: error.message });
    }
  }

  /**
   * Get all tasks for the authenticated user, optionally filtered by completion status.
   * GET /api/tasks?completed=true
   * GET /api/tasks
   * Protected route. Requires JWT.
   */
  public async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const { completed } = req.query;
      const userId = req.userId as string;

      if (!userId) {
        res.status(401).json({ message: 'User ID not found in request (authentication error).' });
        return;
      }

      let tasks: Task[];
      if (completed !== undefined) {
        const isCompleted = typeof completed === 'string' 
          ? completed.toLowerCase() === 'true' 
          : Boolean(completed);
        tasks = await getTasksByCompletionStatusForUser(isCompleted, userId);
      } else {
        tasks = await getAllTasksForUser(userId);
      }
      res.status(200).json(tasks);
    } catch (error: any) {
      console.error('Error in getAllTasks:', error);
      res.status(500).json({ message: 'Failed to retrieve tasks.', error: error.message });
    }
  }

  /**
   * Get a single task by ID for the authenticated user.
   * GET /api/tasks/:id
   * Protected route. Requires JWT.
   */
  public async getTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId as string;

      if (!userId) {
        res.status(401).json({ message: 'User ID not found in request (authentication error).' });
        return;
      }

      const task = await getTaskById(id, userId);

      if (!task) {
        res.status(404).json({ message: 'Task not found or you do not have permission to access it.' });
        return;
      }
      res.status(200).json(task);
    } catch (error: any) {
      console.error('Error in getTask:', error);
      res.status(500).json({ message: 'Failed to retrieve task.', error: error.message });
    }
  }

  /**
   * Update an existing task for the authenticated user.
   * PUT /api/tasks/:id
   * Protected route. Requires JWT.
   */
  public async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId as string;
      const updates: Partial<Task> = req.body;
      
      if (!userId) {
        res.status(401).json({ message: 'User ID not found in request (authentication error).' });
        return;
      }

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        return;
      }

      if (updates.completed !== undefined) {
          updates.completed = Boolean(updates.completed);
      }

      const success = await updateTaskFields(id, userId, updates);
      if (!success) {
        res.status(403).json({ message: 'Not authorized to update this task or task not found.' });
        return;
      }
      res.status(200).json({ message: 'Task updated successfully.' });
    } catch (error: any) {
      console.error('Error in updateTask:', error);
      res.status(500).json({ message: 'Failed to update task.', error: error.message });
    }
  }

  /**
   * Delete a task for the authenticated user.
   * DELETE /api/tasks/:id
   * Protected route. Requires JWT.
   */
  public async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId as string;

      if (!userId) {
        res.status(401).json({ message: 'User ID not found in request (authentication error).' });
        return;
      }

      const success = await deleteTask(id, userId);
      if (!success) {
        res.status(403).json({ message: 'Not authorized to delete this task or task not found.' });
        return;
      }
      res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error: any) {
      console.error('Error in deleteTask:', error);
      res.status(500).json({ message: 'Failed to delete task.', error: error.message });
    }
  }
}

export default new TasksController();