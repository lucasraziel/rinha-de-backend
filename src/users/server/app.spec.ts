import UserRepositoryMock from "../repository/user.repository.mock";
import { RedisMemoryServer } from 'redis-memory-server';
import { Redis } from 'ioredis';
import { FastifyInstance } from "fastify";
import getApp from "./app";
import { Queue } from "bull";
import createInsertQueue from "../tasks/insert-task";
import { UserRepository } from "../repository/user.repository";
import UserDTO from "../dtos/user.dto";

let server: RedisMemoryServer;
let host: string;
let port: number;
let app: FastifyInstance;
let insertQueue: Queue<UserDTO>;

let redisRepository: UserRepository;
let mongoRepository: UserRepository;


describe('UserRepositoryRedis', () => {
    beforeAll(async () => {
        server = new RedisMemoryServer();
        host = await server.getHost();
        port = await server.getPort();
        
    }, 30000);

    beforeEach( ()=> {
        redisRepository = new UserRepositoryMock();
        mongoRepository = new UserRepositoryMock();
        insertQueue = createInsertQueue(host, port, mongoRepository);
        app = getApp(mongoRepository, redisRepository, insertQueue);
    })

    afterAll(async () => {
        await server.stop();
    }, 30000);

    afterEach(async () => {
        const client = new Redis({
            host,
            port,
        });
        await client.flushall();
        client.disconnect();
        await insertQueue.close();
    });

    it('should be able to save a user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/pessoas',
            body: {
                apelido: 'apelido',
                nome: 'nome',
                nascimento: '2020-01-01',
                stack: ['stack']
            }
        })
        expect(response.statusCode).toBe(201);
        expect(response.headers.location?.toString().includes('/pessoas')).toBe(true);
    });

    it('should be able to save a user without stack', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/pessoas',
            body: {
                apelido: 'apelido',
                nome: 'nome',
                nascimento: '2020-01-01',
                stack: null
            },
        })
        expect(response.statusCode).toBe(201);
        expect(response.headers.location?.toString().includes('/pessoas')).toBe(true);
    });

    it('should be able to get a user saved', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/pessoas',
            body: {
                apelido: 'apelido',
                nome: 'nome',
                nascimento: '2020-01-01',
                stack: null
            },
        })
        expect(response.statusCode).toBe(201);
        expect(response.headers.location?.toString().includes('/pessoas')).toBe(true);

        const responseFound = await app.inject({
            method: 'GET',
            url: response.headers.location?.toString(),
        })
        expect(responseFound.statusCode).toBe(200);
    });

    it('should return 404 when there is no user', async () => {
        

        const responseFound = await app.inject({
            method: 'GET',
            url: '/pessoas/123',
        })
        expect(responseFound.statusCode).toBe(404);
    });

    it('should be able to search by term', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/pessoas',
            body: {
                apelido: 'apelido',
                nome: 'nome',
                nascimento: '2020-01-01',
                stack: null
            },
        })
        expect(response.statusCode).toBe(201);
        expect(response.headers.location?.toString().includes('/pessoas')).toBe(true);

        const responseFound = await app.inject({
            method: 'GET',
            url: '/pessoas?term=apelido',
        })
        expect(responseFound.statusCode).toBe(200);
        console.log(responseFound.body)
        expect(JSON.parse(responseFound.body).length).toBe(1);
    });

});

