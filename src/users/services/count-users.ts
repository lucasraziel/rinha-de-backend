import { UserRepository } from "../repository/user.repository";

export default class CountUsersService {
    constructor(private readonly userRepository: UserRepository) { }
    async execute() {
        return this.userRepository.count();
    }
}