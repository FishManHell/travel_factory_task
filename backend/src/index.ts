import 'reflect-metadata';
import { app } from './app';
import { AppDataSource } from './config/data-source';

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
