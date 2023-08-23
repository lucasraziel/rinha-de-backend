import UserRepositoryMock from "../repository/user.repository.mock";
import CountUsersService from "./count-users";

describe('CountUsers', () => {
    it('should be able to count users', async () => {
        const repository = new UserRepositoryMock();
        const countUsersService = new CountUsersService(repository);
        const count = await countUsersService.execute();
        expect(count).toBe(0);
    });
});