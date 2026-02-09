import fastify from "fastify";
import authRoutes from "./routes/auth";

const app = fastify({
    logger: true
})

app.get('/', async function (request, reply) {
    return {hello: 'world'}
});

app.register(authRoutes);

const start = async () => {
    try {
        await app.listen({port: 3000})
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

start();