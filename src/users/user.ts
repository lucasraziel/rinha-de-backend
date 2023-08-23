import { v4 as uuid, validate as validateUUID } from 'uuid';

export default class User {
    public readonly id: string;
    public readonly apelido: string;
    public readonly nome: string;
    public readonly nascimento: Date;
    public readonly stack: string[] | null;

    constructor(apelido: string, nome: string, nascimento: Date, stack: string[] | null, id?: string) {
        this.id = id ?? uuid();
        this.apelido = apelido;
        this.nome = nome;
        this.nascimento = nascimento;
        this.stack = stack;

        this.validate();
    }

    private validate(): void {
        if (this.stack && this.stack.length === 0) {
            throw new Error('Stack vazia');
        }
        if (!validateUUID(this.id)) {
            throw new Error('ID inválido');
        }
    }
}