import { RedisMemoryServer } from 'redis-memory-server';
import User from '../user';
import UserRepositoryRedis from './user.repository.redis';
import { Redis } from 'ioredis';

let server: RedisMemoryServer;
let uri: string;
describe('UserRepositoryRedis', () => {
    beforeAll(async () => {
        server = new RedisMemoryServer();
        const host = await server.getHost();
        const port = await server.getPort();
        uri = `redis://${host}:${port}`;
    }, 30000);

    afterAll(async () => {
        await server.stop();
    }, 30000);

    afterEach(async () => {
        const client = new Redis(uri);
        await client.flushall();
        client.disconnect();
    });

    it('should be able to save a user', async () => {
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        const repository = new UserRepositoryRedis(uri);
        await expect(repository.save(user)).resolves.toBeFalsy();
        repository.close();
    });

    it('should be able to find a user by id', async () => {
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        const repository = new UserRepositoryRedis(uri);

        await repository.save(user);
        const foundUser = await repository.findById(user.id);
        expect(foundUser?.id).toEqual(user.id);
        repository.close();
    }, 30000);


});
