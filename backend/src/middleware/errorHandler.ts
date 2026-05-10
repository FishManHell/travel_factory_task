import { ErrorRequestHandler } from 'express';

export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message });
        return;
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
};
