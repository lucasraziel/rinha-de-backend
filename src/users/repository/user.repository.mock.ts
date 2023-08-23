import User from "../user";
import { UserRepository } from "./user.repository";

export default class UserRepositoryMock implements UserRepository {
    
    private users: User[] = [];

    async save(user: User): Promise<void> {
        this.users.push(user);
    }
    async findByTerm(term: string): Promise<User[]> {
        const usersFound = this.users.filter((user) => 
            user.apelido.includes(term) || user.nome.includes(term) || !!user.stack?.find((stack) => stack.includes(term))
        )

        return usersFound;
    }
    async findById(id: string): Promise<User | undefined> {
        return this.users.find((user) => user.id === id);
    }
    async count(): Promise<number> {
        return this.users.length;
    }

    async findByApelido(apelido: string): Promise<User | undefined> {
        return this.users.find((user) => user.apelido === apelido);
    }

}