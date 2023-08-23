import CreateUserDTO from "../dtos/create-user.dto";
import {v4 as uuid} from 'uuid'
import { DTOToUser } from "../dtos/user.dto";
import { UserRepository } from "../repository/user.repository";
import User from "../user";

export default class SaveUserService {
    constructor(private readonly userRepository: UserRepository) {}
    public async execute(userDTO: CreateUserDTO): Promise<User> {
        const user = DTOToUser({...userDTO, id: uuid()})
        await this.userRepository.save(user);
        return user;
    }
}