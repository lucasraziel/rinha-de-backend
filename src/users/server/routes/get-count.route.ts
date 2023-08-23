import {FastifyRequest as Request, FastifyReply as Response} from 'fastify'
import AppError from '../../error/error.app';
import { UserRepository } from '../../repository/user.repository';
import CountUsersService from '../../services/count-users';
export default function getCountRoute(mongoRepository: UserRepository){
    const injectedMongoRepository = mongoRepository;

    return async function GetCountRoute(request: Request, response: Response) {
        try {
            const getCounttService = new CountUsersService(injectedMongoRepository);

            const count = await getCounttService.execute();

            return response.header('Content-Type',  'plain/text').status(200).send(`${count}`);
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            }
            console.log(err)
            throw new AppError('Erro inesperado', 400, err as Error);
        }
    }
}
