import fastify from "fastify";

const app = fastify({
    logger: true
})

app.get('/', async function (request, reply) {
    return {hello: 'world'}
});

const start = async () => {
    try {
        await app.listen({port: 3000})
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

start();