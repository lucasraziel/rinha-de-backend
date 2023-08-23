import { Document, Model, model } from "mongoose";
import CreateUserDTO from "../dtos/create-user.dto";
import UserSchema from "./user.schema";
import User from "../user";

export interface UserDocument extends CreateUserDTO, Document<string> {}

export interface UserModelType extends Model<UserDocument> {}

const UserModel = model<UserDocument>("user", UserSchema);

export default UserModel;

export function modelToUser(userModel: UserDocument): User {
    return new User(userModel.apelido, userModel.nome, userModel.nascimento, userModel.stack ?? null, userModel.id);
}