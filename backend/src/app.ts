import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/userRoutes';
import { vacationRequestRouter } from './routes/vacationRequestRoutes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/users', userRouter);
app.use('/requests', vacationRequestRouter);

app.use(errorHandler);
