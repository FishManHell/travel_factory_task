import { Router } from 'express';
import * as vacationRequestController from '../controllers/vacationRequestController';

export const vacationRequestRouter = Router();

vacationRequestRouter.get('/', vacationRequestController.getRequests);
vacationRequestRouter.post('/', vacationRequestController.createRequest);
vacationRequestRouter.patch('/:id/approve', vacationRequestController.approveRequest);
vacationRequestRouter.patch('/:id/reject', vacationRequestController.rejectRequest);
