import {FastifyRequest as Request, FastifyReply as Response} from 'fastify'
import AppError from '../../error/error.app';
import {z} from 'zod';
import { UserRepository } from '../../repository/user.repository';
import { Queue } from 'bull';
import SaveUserService from '../../services/save-user';
import UserDTO from '../../dtos/user.dto';
export default function getSaveRoute(redisRepository: UserRepository, mongoRepository: UserRepository){
    const injectedRedisRepository = redisRepository;
    const injectedMongoRepository = mongoRepository;

    return async function SaveUserRoute(request: Request, response: Response) {
        try {
    
            const data  = request.body  as { apelido: string, nome: string, nascimento: string, stack: string[] |null };
    
            if (!data?.apelido || !data?.nome || !data?.nascimento) {
                throw new AppError('Apelido e nome são obrigatórios', 422);
            }
            const existApelido = await injectedRedisRepository.findByApelido(data.apelido);
            if (existApelido) {
                throw new AppError('Apelido já existe', 422);
            }

            const user = z.object({
                apelido: z.string().min(1).max(32),
                nome: z.string().min(1).max(100),
                nascimento: z.coerce.date(),
                stack: z.array(z.string().min(1).max(32)).min(1).nullable()
            }).parse(data);
            

            const saveUserService = new SaveUserService(injectedRedisRepository);
            const newUser = await saveUserService.execute(user);

            await injectedMongoRepository.save(newUser);

            return response.status(201).header('Content-Type',  'application/json').header('Location', `/pessoas/${newUser.id}`).send(newUser);
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            }

            if (err instanceof z.ZodError) {
                throw new AppError('Erro de validação', 400, err);
            }
            console.log(err)
            throw new AppError('Erro inesperado', 400, err as Error);
        }
    }
}
