import { UserRepository } from "../repository/user.repository";

export default class FindByTermService {
    constructor(private readonly userRepository: UserRepository) { }
    async execute(term: string) {
        return this.userRepository.findByTerm(term);
    }
}