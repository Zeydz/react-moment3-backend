import fastify, { FastifyReply, FastifyRequest } from "fastify";
import authRoutes from "./routes/auth";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";

const app = fastify({
  logger: true,
});

app.register(fastifyCookie);

/* Create JWT */
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  cookie: {
    cookieName: "token",
    signed: false,
  },
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});

/* Authenticate decorator, since Fastify doesnt provide authentication strategies  */
app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
});

app.get("/", async function (request, reply) {
  return { hello: "world" };
});

/* GUARDED ROUTE TEST */
app.get('/me', { preValidation: [app.authenticate]}, async (request, reply) => {
    return { user: request.user}
})

app.register(authRoutes);

/* Start app */
const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
