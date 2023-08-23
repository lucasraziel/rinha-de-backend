import UserRepositoryMock from "../repository/user.repository.mock";
import User from "../user";
import GetUserService from "./get-user";

describe('GetUserService', ()=>{
    it('should be able to get a user', async ()=>{
        const repository = new UserRepositoryMock();
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        await repository.save(user);
        const getUserService = new GetUserService(repository);
        const userFound = await getUserService.execute(user.id);
        expect(userFound).toStrictEqual(user);

    })

    it('should not return a user when there is none', async ()=>{
        const repository = new UserRepositoryMock();
        const getUserService = new GetUserService(repository);
        const userFound = await getUserService.execute('id');
        expect(userFound).toBeUndefined();
    });
})