import User from "../user";

export interface UserRepository {
    save(user: User): Promise<void>;
    findByTerm(term: string): Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByApelido(apelido: string): Promise<User | undefined>;
    count(): Promise<number>;
}