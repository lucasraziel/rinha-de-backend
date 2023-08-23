import * as Queue from 'bull'
import { UserRepository } from '../repository/user.repository';
import UserDTO, { DTOToUser } from '../dtos/user.dto';

const createInsertQueue = (host: string, port: number, repository: UserRepository) => {
  const queue =  new Queue.default<UserDTO>('insert-task', {
    redis: {
      host,
      port,
    },
  });

  queue.process(async (job) => {
    const user = DTOToUser({...job.data});
    await repository.save(user);
  });

  return queue;
}

export default createInsertQueue;