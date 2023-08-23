import { UserRepository } from "../repository/user.repository";
import Fastify from "fastify";
import createInsertQueue from "../tasks/insert-task";
import getSaveRoute from "./routes/save-user.route";
import getGetRoute from "./routes/get-user.route";
import getSearchRoute from "./routes/search-by-term.route";
import getCountRoute from "./routes/get-count.route";
import { Queue } from "bull";
import UserDTO from "../dtos/user.dto";

export default function getApp(mongoRepository: UserRepository, redisRepository: UserRepository, insertQueue: Queue<UserDTO>) {
    const injectedMongoRepository = mongoRepository;
    const injectedRedisRepository = redisRepository;

    const app = Fastify();

    const saveRoute = getSaveRoute(injectedRedisRepository, mongoRepository);
    const getRoute = getGetRoute(injectedRedisRepository);
    const findByTermRoute = getSearchRoute(injectedMongoRepository);
    const countRoute = getCountRoute(injectedMongoRepository);

    app.post('/pessoas', saveRoute);
    app.get('/pessoas', findByTermRoute);
    app.get('/pessoas/:id', getRoute);
    app.get('/contagem-pessoas', countRoute);

    return app;

}