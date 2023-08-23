import {FastifyRequest as Request, FastifyReply as Response} from 'fastify'
import AppError from '../../error/error.app';
import { UserRepository } from '../../repository/user.repository';
import GetUserService from '../../services/get-user';
export default function getGetRoute(redisRepository: UserRepository){
    const injectedRedisRepository = redisRepository;

    return async function GetUserRoute(request: Request, response: Response) {
        try {
    
            const data  = request.params as { id: string };

            if (!data?.id) {
                throw new AppError('Id é obrigatório', 422);
            }

            const getUserService = new GetUserService(injectedRedisRepository);

            const user = await getUserService.execute(data.id);

            if(!user){
                return response.status(404).send();
            }

            return response.header('Content-Type',  'application/json').status(200).send(user);
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            }
            console.log(err);
            throw new AppError('Erro inesperado', 400, err as Error);
        }
    }
}
