import User from "./user";
import { v4 as uuid } from 'uuid';

describe('User', () => {
    it('should be able to create a new user without id', () => {
        const user = new User('apelido', 'nome', new Date(), ['stack']);
        expect(user).toHaveProperty('id');
    });
    it ('should be able to create a new user with id', () => {
        const uuidValue = uuid();
        const user = new User('apelido', 'nome', new Date(), ['stack'], uuidValue);
        expect(user).toHaveProperty('id');
        expect(user.id).toBe(uuidValue);
    });
    it ('should not be able to create a new user with empty stack', () => {
        expect(() => {
            new User('apelido', 'nome', new Date(), []);
        }).toThrow('Stack vazia');
    });
    it ('should not be able to create a new user with invalid id', () => {
        expect(() => {
            new User('apelido', 'nome', new Date(), ['stack'], 'invalid-id');
        }).toThrow('ID inválido');
    });
});