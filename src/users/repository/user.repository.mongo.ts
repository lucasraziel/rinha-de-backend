import UserDTO, { userToDTO } from "../dtos/user.dto";
import User from "../user";
import { UserRepository } from "./user.repository";
import UserModel, { modelToUser } from "./user.model";
import Mongoose, {Connection} from 'mongoose'

export default class UserRepositoryMongo implements UserRepository {
    private readonly client: Connection;
    private readonly collectionName = 'users';

    constructor(connectionString: string) {
        Mongoose.connect(connectionString, {maxPoolSize: 3000});
        this.client = Mongoose.connection;

        this.client.once("open",  () => {
            console.log("Connected to database");
        });


        this.client.on("error", () => {
            console.log("Error connecting to database");
        });
    }
    async findByApelido(apelido: string): Promise<User | undefined> {
        const user =  await UserModel.findOne({apelido}).exec();
        if (user) {
            return modelToUser(user);
        }
        return undefined;
    }

    public async save(user: User): Promise<void> {
        await UserModel.create(userToDTO(user));
    }
    public async findByTerm(term: string): Promise<User[]> {
        const users = await UserModel.find({
            $or: [{
                apelido: new RegExp(term, 'gi')
            },
            {
                nome: new RegExp(term, 'gi')
            },
            {
                stack: new RegExp(term, 'gi')
            }
        ]
        }).exec()
        
        return users.map((user) => modelToUser(user));
    }
    public async findById(id: string): Promise<User | undefined> {
        const user = await UserModel.findById(id).limit(50).exec();
        return user ? modelToUser(user) : undefined;
    }
    public async count(): Promise<number> {
        return await UserModel.countDocuments().exec();
    }
}