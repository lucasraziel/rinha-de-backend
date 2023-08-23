import { Schema } from "mongoose";

const UserSchema = new Schema({
  apelido: String,
  nome: String,
  age: Number,
  nascimento: {
    type: Date,
  },
  stack: {
    type: [String],
    default: null,
  },
  _id: Schema.Types.UUID,
});

UserSchema.index({apelido: 'text', nome: 'text', stack: 'text'})
export default UserSchema;

