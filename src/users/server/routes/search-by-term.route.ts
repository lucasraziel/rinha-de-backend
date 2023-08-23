import {FastifyRequest as Request, FastifyReply as Response} from 'fastify'
import AppError from '../../error/error.app';
import { UserRepository } from '../../repository/user.repository';
import FindByTermService from '../../services/find-by-term';
import CreateUserDTO from '../../dtos/create-user.dto';
import { Queue } from 'bull';
import UserDTO from '../../dtos/user.dto';
export default function getSearchRoute(mongoRepository: UserRepository,){
    const injectedMongoRepository = mongoRepository;

    return async function GetSearchRoute(request: Request, response: Response) {
        try {
    
            const data  = request.query as { t: string };

            if (!data?.t) {
                throw new AppError('Term é obrigatório', 400);
            }


            const findByermService = new FindByTermService(injectedMongoRepository);

            const users = await findByermService.execute(data.t);

            return response.status(200).header('Content-Type',  'application/json').send(users);
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            }
            console.log(err)
            throw new AppError('Erro inesperado', 400, err as Error);
        }
    }
}
