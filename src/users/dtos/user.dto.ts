import User from "../user";

export default  interface UserDTO {
    id: string;
    apelido: string;
    nome: string;
    nascimento: Date;
    stack: string[] | null;
}


export function userToDTO(user: User): UserDTO {
    return {
        id: user.id,
        apelido: user.apelido,
        nome: user.nome,
        nascimento: user.nascimento,
        stack: user.stack,
    };
}

export function DTOToUser(userDTO: UserDTO): User {
    return new User(userDTO.apelido, userDTO.nome, userDTO.nascimento, userDTO.stack ?? null, userDTO.id);
}
