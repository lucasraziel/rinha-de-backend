import UserRepositoryMock from "../repository/user.repository.mock";
import SaveUserService from "./save-user";

describe('SaveUser', () => {
    it('should be able to save a user', async () => {
        const repository = new UserRepositoryMock();
        const saveUserService = new SaveUserService(repository);
        const user = await saveUserService.execute({
            apelido: 'apelido',
            nome: 'nome',
            nascimento: new Date(),
            stack: ['stack']
        });

        const count = await repository.count();
        expect(count).toBe(1);
        expect(user.apelido).toBe('apelido');
    });

});