import UserRepositoryMock from "../repository/user.repository.mock";
import User from "../user";
import FindByTermService from "./find-by-term";

describe('FindUserByTerm', () => {
    it('should be able to find users by term', async () => {
        const repository = new UserRepositoryMock();
        const findUserByTermService = new FindByTermService(repository);
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        await repository.save(user);

        const usersFoundTest = await findUserByTermService.execute('ome');
        expect(usersFoundTest.length).toBe(1);
    });
});
