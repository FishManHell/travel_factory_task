import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import { userRouter } from './routes/userRoutes';
import { vacationRequestRouter } from './routes/vacationRequestRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/users', userRouter);
app.use('/requests', vacationRequestRouter);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized');
        app.listen(PORT, () => {
            console.log('Server is running');
        });
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
        process.exit(1);
    });
