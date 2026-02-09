import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/db";
import bcrypt from "bcrypt";

export default async function authRoutes(fastify: FastifyInstance) {
  /* REGISTER USER */
  fastify.post("/auth/register", async (request, reply) => {
    try {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      /* Check if user exists */
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        return reply.status(400).send({ error: "User already exists" });
      }

      /* Hash password */
      const passwordHash = await bcrypt.hash(password, 10);

      /* Create user */
      const user = await prisma.user.create({
        data: {
          username,
          passwordHash,
        },
      });
      return reply.status(201).send({
        message: "User created",
        user: { id: user.id, username: user.username },
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  /* LOGIN USER */
  fastify.post("/auth/login", async (request, reply) => {
    try {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      /* Get user */
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        return reply
          .status(400)
          .send({ error: "Invalid username or password" });
      }

      /* Check password */
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return reply
          .status(400)
          .send({ error: "Invalid username or password" });
      }

      /* Create JWT */
      const token = fastify.jwt.sign({
        userId: user.id,
        username: user.username,
      });
      /* Set cookie */
      reply.setCookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return reply.send({
        message: "Login successful",
        user: { id: user.id, username: user.username },
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
