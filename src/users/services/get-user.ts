import { UserRepository } from "../repository/user.repository";
import User from "../user";

export default class GetUserService {
    constructor(private readonly userRepository: UserRepository) {}
    public async execute(userId: string): Promise<User | undefined> {
        return this.userRepository.findById(userId);
    }
}