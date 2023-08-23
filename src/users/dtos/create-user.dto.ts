export default interface CreateUserDTO {
    apelido: string;
    nome: string;
    nascimento: Date;
    stack: string[] | null;
}