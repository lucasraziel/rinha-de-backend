import UserRepositoryMongo from "../repository/user.repository.mongo";
import UserRepositoryRedis from "../repository/user.repository.redis";
import createInsertQueue from "../tasks/insert-task";
import getApp from "./app";
import {z} from 'zod';
const env = z.object({
    MONGO_URI: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
}).parse(process.env);

const mongoRepository = new UserRepositoryMongo(env.MONGO_URI);
const redisRepository = new UserRepositoryRedis(`redis://${env.REDIS_HOST}:${env.REDIS_PORT}`);

const insertQueue = createInsertQueue(env.REDIS_HOST, env.REDIS_PORT, mongoRepository);




const app = getApp(mongoRepository, redisRepository, insertQueue);

app.listen({ port: 3000 }, function (err, address) {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log('listening to port 3000');
    // Server is now listening on ${address}
  });
