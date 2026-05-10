import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { User } from './entities/User';

async function seed() {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    const existingCount = await userRepository.count();
    if (existingCount > 0) {
        console.log(`Users table already has ${existingCount} rows, skipping seed`);
        return;
    }

    const users = userRepository.create([
        { name: 'Alice', role: 'Requester' },
        { name: 'Bob', role: 'Validator' },
    ]);
    await userRepository.save(users);

    console.log(`Seeded ${users.length} users`);
}

seed()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });
