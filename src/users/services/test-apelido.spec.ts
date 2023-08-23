import UserRepositoryMock from "../repository/user.repository.mock";
import User from "../user";
import TestApelidoService from "./test-apelido";

describe('TestApelido', () => {
    it('should be able to test apelido when empty', async () => {
        const userRepositoryMock = new UserRepositoryMock();
        const testApelidoService = new TestApelidoService(userRepositoryMock);

        const result = await testApelidoService.execute('apelido');
        expect(result).toBe(false);
    });
    it('should be able to test apelido when not empty', async () => {
        const userRepositoryMock = new UserRepositoryMock();
        const testApelidoService = new TestApelidoService(userRepositoryMock);

        const user = new User('apelido', 'nome', new Date(), ['stack']);
        await userRepositoryMock.save(user);

        const result = await testApelidoService.execute('apelido');
        expect(result).toBe(true);
    });
});