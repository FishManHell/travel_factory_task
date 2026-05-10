import 'reflect-metadata';
import request from 'supertest';
import { app } from '../src/app';
import { AppDataSource } from '../src/config/data-source';
import { User } from '../src/entities/User';

let aliceId: number;
let bobId: number;

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

beforeEach(async () => {
    await AppDataSource.query(
        'TRUNCATE TABLE vacation_requests, users RESTART IDENTITY CASCADE'
    );

    const userRepo = AppDataSource.getRepository(User);
    const [alice, bob] = await userRepo.save([
        userRepo.create({ name: 'Alice', role: 'Requester' }),
        userRepo.create({ name: 'Bob', role: 'Validator' }),
    ]);
    aliceId = alice.id;
    bobId = bob.id;
});

describe('GET /users', () => {
    it('returns the seeded users', async () => {
        const res = await request(app).get('/users');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'Alice', role: 'Requester' }),
                expect.objectContaining({ name: 'Bob', role: 'Validator' }),
            ])
        );
    });
});

describe('POST /requests', () => {
    it('creates a pending request with reason', async () => {
        const res = await request(app)
            .post('/requests')
            .send({
                userId: aliceId,
                startDate: '2026-06-01',
                endDate: '2026-06-10',
                reason: 'Family trip',
            });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            user: { id: aliceId, name: 'Alice' },
            startDate: '2026-06-01',
            endDate: '2026-06-10',
            reason: 'Family trip',
            status: 'pending',
            comments: null,
        });
    });

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/requests')
            .send({ startDate: '2026-06-01', endDate: '2026-06-10' });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/userId/);
    });
});

describe('GET /requests', () => {
    it('filters requests by userId', async () => {
        await request(app)
            .post('/requests')
            .send({ userId: aliceId, startDate: '2026-06-01', endDate: '2026-06-10' });

        const res = await request(app).get(`/requests?userId=${aliceId}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].user.id).toBe(aliceId);
    });
});

describe('PATCH /requests/:id/approve', () => {
    it('approves a pending request', async () => {
        const created = await request(app)
            .post('/requests')
            .send({ userId: aliceId, startDate: '2026-06-01', endDate: '2026-06-10' });

        const res = await request(app).patch(`/requests/${created.body.id}/approve`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('approved');
    });

    it('returns 400 when the request is not pending', async () => {
        const created = await request(app)
            .post('/requests')
            .send({ userId: aliceId, startDate: '2026-06-01', endDate: '2026-06-10' });

        await request(app).patch(`/requests/${created.body.id}/approve`);
        const res = await request(app).patch(`/requests/${created.body.id}/approve`);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/not pending/);
    });
});

describe('PATCH /requests/:id/reject', () => {
    it('rejects a pending request and stores comments', async () => {
        const created = await request(app)
            .post('/requests')
            .send({ userId: aliceId, startDate: '2026-06-01', endDate: '2026-06-10' });

        const res = await request(app)
            .patch(`/requests/${created.body.id}/reject`)
            .send({ comments: 'Period overloaded' });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('rejected');
        expect(res.body.comments).toBe('Period overloaded');
    });
});
