import { UserRepository } from "../repository/user.repository";

export default class TestApelidoService {
    private userRepository: UserRepository;
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(apelido: string): Promise<boolean> {
        const user = await this.userRepository.findByApelido(apelido);
        return !!user;
    }
}