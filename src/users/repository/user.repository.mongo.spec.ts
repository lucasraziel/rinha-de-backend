import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../user';
import UserRepositoryMongo from './user.repository.mongo';
import UserModel from './user.model';

let mongod: MongoMemoryServer;
let uri: string;
describe('UserRepositoryMongo', () => {
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
    }, 30000);

    afterAll(async () => {
        await mongod.stop();
    }, 30000);

    afterEach(async () => {
        await UserModel.deleteMany({}).exec();
    });

    it('should be able to save a user', async () => {
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        const repository = new UserRepositoryMongo(uri);
        await expect(repository.save(user)).resolves.toBeFalsy();
    });

    it('should be able to find a user by id', async () => {
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        const repository = new UserRepositoryMongo(uri);

        await repository.save(user);
        const foundUser = await repository.findById(user.id);
        expect(foundUser?.id).toEqual(user.id);
    }, 30000);

    it('should be able to find a user by apelido', async () => {
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        const repository = new UserRepositoryMongo(uri);

        await repository.save(user);
        const foundUser = await repository.findByApelido(user.apelido);
        expect(foundUser?.id).toEqual(user.id);
    }, 30000);

    it('should be able to find a user by term', async () => {
        const user = new User('test', 'Funny', new Date(), ['java']);
        const repository = new UserRepositoryMongo(uri);
        await repository.save(user);

        const usersFoundTest = await repository.findByTerm('test');
        expect(usersFoundTest.length).toBe(1);

        const usersFoundFunny = await repository.findByTerm('unny');
        expect(usersFoundFunny.length).toBe(1);

        const usersFoundJava = await repository.findByTerm('jav');
        expect(usersFoundJava.length).toBe(1);
    }, 30000);


    it('should be able to count users', async () => {
        const user = new User('test', 'Funny', new Date(), ['java']);
        const repository = new UserRepositoryMongo(uri);
        await repository.save(user);

        const count = await repository.count();

        expect(count).toBe(1);
    }, 30000);

});
