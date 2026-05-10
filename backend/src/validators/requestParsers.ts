import { HttpError } from '../middleware/errorHandler';

export function parseIdParam(value: unknown): number {
    if (typeof value !== 'string') {
        throw new HttpError(400, 'Invalid id');
    }
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, 'Invalid id');
    }
    return id;
}

export function parseOptionalNumberQuery(value: unknown, name: string): number | undefined {
    if (value === undefined) return undefined;
    const n = Number(value);
    if (Number.isNaN(n)) {
        throw new HttpError(400, `${name} must be a number`);
    }
    return n;
}

export function parseRequiredNumber(value: unknown, name: string): number {
    if (typeof value !== 'number') {
        throw new HttpError(400, `${name} must be a number`);
    }
    return value;
}

export function parseRequiredString(value: unknown, name: string): string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new HttpError(400, `${name} is required`);
    }
    return value.trim();
}

export function parseOptionalString(value: unknown, name: string): string | null {
    if (value === undefined || value === null) return null;
    if (typeof value !== 'string') {
        throw new HttpError(400, `${name} must be a string`);
    }
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
}
