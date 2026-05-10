import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getAllUsers(_req: Request, res: Response): Promise<void> {
    const users = await userService.getAllUsers();
    res.json(users);
}
