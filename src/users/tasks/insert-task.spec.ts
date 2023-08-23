import { RedisMemoryServer } from 'redis-memory-server';
import { Redis } from 'ioredis';
import createInsertQueue from './insert-task';
import UserRepositoryMock from '../repository/user.repository.mock';
import { v4 as uuid } from 'uuid';

let server: RedisMemoryServer;
let host: string;
let port: number;

describe('InsertTask', () => {

    beforeAll(async () => {
        server = new RedisMemoryServer();
        host = await server.getHost();
        port = await server.getPort();
    }, 30000);


    it('should be able to insert a task', async () => {
        const repository = new UserRepositoryMock();
        const queue = createInsertQueue(host, port, repository);
        queue.add({
            nome: 'name',
            apelido: 'nickname',
            nascimento: new Date(),
            stack: ['stack'],
            id: uuid()
        })
        setTimeout(async ()=>{
            const count = await repository.count();
            expect(count).toBe(1);
            await  queue.close();
            const client = new Redis({
                host,
                port,
            });
            await client.flushall();
            client.disconnect();
            await server.stop();
        }, 200)
    });

});