import { Request, Response } from 'express';
import * as vacationRequestService from '../services/vacationRequestService';
import {
    parseIdParam,
    parseOptionalNumberQuery,
    parseOptionalString,
    parseRequiredNumber,
    parseRequiredString,
} from '../validators/requestParsers';

export async function getRequests(req: Request, res: Response): Promise<void> {
    const userId = parseOptionalNumberQuery(req.query.userId, 'userId');
    const requests = await vacationRequestService.getRequests(userId);
    res.json(requests);
}

export async function createRequest(req: Request, res: Response): Promise<void> {
    const body = req.body ?? {};
    const userId = parseRequiredNumber(body.userId, 'userId');
    const startDate = parseRequiredString(body.startDate, 'startDate');
    const endDate = parseRequiredString(body.endDate, 'endDate');
    const reason = parseOptionalString(body.reason, 'reason');

    const created = await vacationRequestService.createRequest({
        userId,
        startDate,
        endDate,
        reason,
    });
    res.status(201).json(created);
}

export async function approveRequest(req: Request, res: Response): Promise<void> {
    const id = parseIdParam(req.params.id);
    const updated = await vacationRequestService.approveRequest(id);
    res.json(updated);
}

export async function rejectRequest(req: Request, res: Response): Promise<void> {
    const id = parseIdParam(req.params.id);
    const comments = parseRequiredString(req.body?.comments, 'comments');
    const updated = await vacationRequestService.rejectRequest(id, comments);
    res.json(updated);
}
