import { DTOToUser, userToDTO } from "../dtos/user.dto";
import User from "../user";
import { UserRepository } from "./user.repository";
import {Redis} from 'ioredis'

export default class UserRepositoryRedis implements UserRepository {
    private readonly client: Redis;
    private readonly collectionName = 'users';

    constructor(connectionString: string) {
        this.client = new Redis(connectionString);
    }

    public async save(user: User): Promise<void> {
        const userDTO = userToDTO(user);
        await this.client.hset(this.collectionName, userDTO.id, JSON.stringify(userDTO));
        await this.client.hset(this.collectionName, userDTO.apelido, JSON.stringify(userDTO));
    }
    public async findByTerm(term: string): Promise<User[]> {
        throw new Error("Method will not be implemented.");
    }

    public async findByApelido(apelido: string): Promise<User | undefined> {
        const user = await this.client.hget(this.collectionName, apelido);
        if(user) {
            return DTOToUser(JSON.parse(user));
        }
        return undefined;
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.client.hget(this.collectionName, id);

        if(user) {
            return DTOToUser(JSON.parse(user));
        }
        return undefined;
    }
    public async count(): Promise<number> {
        throw new Error("Method will not be implemented.");
    }

    public close(): void {
        this.client.disconnect();
    }
}