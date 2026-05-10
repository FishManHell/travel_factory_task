import { AppDataSource } from '../config/data-source';
import { VacationRequest } from '../entities/VacationRequest';
import { User } from '../entities/User';
import { HttpError } from '../middleware/errorHandler';

const requestRepository = AppDataSource.getRepository(VacationRequest);
const userRepository = AppDataSource.getRepository(User);

async function getPendingRequestOrThrow(id: number): Promise<VacationRequest> {
    const request = await requestRepository.findOneBy({ id });
    if (!request) {
        throw new HttpError(404, 'Request not found');
    }
    if (request.status !== 'pending') {
        throw new HttpError(400, 'Request is not pending');
    }
    return request;
}

export async function getRequests(userId?: number): Promise<VacationRequest[]> {
    return requestRepository.find({
        where: userId !== undefined ? { user: { id: userId } } : undefined,
        order: { createdAt: 'DESC' },
    });
}

export async function createRequest(data: {
    userId: number;
    startDate: string;
    endDate: string;
    reason?: string | null;
}): Promise<VacationRequest> {
    if (new Date(data.endDate) < new Date(data.startDate)) {
        throw new HttpError(400, 'endDate must be greater than or equal to startDate');
    }

    const user = await userRepository.findOneBy({ id: data.userId });
    if (!user) {
        throw new HttpError(404, 'User not found');
    }

    const request = requestRepository.create({
        user,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason ?? null,
        status: 'pending',
        comments: null,
    });
    return requestRepository.save(request);
}

export async function approveRequest(id: number): Promise<VacationRequest> {
    const request = await getPendingRequestOrThrow(id);
    request.status = 'approved';
    return requestRepository.save(request);
}

export async function rejectRequest(id: number, comments: string): Promise<VacationRequest> {
    const request = await getPendingRequestOrThrow(id);
    request.status = 'rejected';
    request.comments = comments;
    return requestRepository.save(request);
}
