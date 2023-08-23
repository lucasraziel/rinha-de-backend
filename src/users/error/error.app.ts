export default class AppError extends Error {
    public readonly statusCode: number;
    constructor(message: string, statusCode: number, cause?: Error) {
        super(message, { cause });
        this.statusCode = statusCode;
    }
}