import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../plugins/db";
import { postBodySchema } from "../schemas/post.schema";

export default async function postRoutes(fastify: FastifyInstance) {
  /* Get all posts */
  fastify.get("/posts", async (request, reply) => {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return reply.status(200).send(posts);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  /* Get specific post */
  fastify.get(
    "/posts/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        /* Parse id */
        const postId = parseInt(request.params.id as string);
        /* Check that ID is a number */
        if (isNaN(postId)) {
          return reply.status(400).send({ error: "Invalid post ID" });
        }

        /* Find specific post */
        const post = await prisma.post.findUnique({
          where: { id: postId },
        });
        if (!post) {
          return reply.status(404).send({ error: "Post not found" });
        }
        return reply.status(200).send(post);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    },
  );

  /* Create new post */
  fastify.post(
    "/posts",
    { preValidation: [fastify.authenticate], schema: { body: postBodySchema } },
    async (request, reply) => {
      try {
        const { title, content } = request.body as any;

        if(!title.trim() || !content.trim()) {
          return reply.status(400).send({ error: "Title and content cannot be empty" });
        }

        const post = await prisma.post.create({
          data: {
            title,
            content,
          },
        });
        return reply.status(201).send(post);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    },
  );

  /* Delete post */
  fastify.delete<{ Params: { id: string } }>(
    "/posts/:id",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      try {
        /* Parse ID */
        const postId = parseInt(request.params.id as string);

        /* Check that ID is a number */
        if (isNaN(postId)) {
          return reply.status(400).send({ error: "Invalid post ID" });
        }

        /* Check if post exists */
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
          return reply.status(404).send({ error: "Post not found" });
        }
        /* Delete post */
        await prisma.post.delete({
          where: { id: postId },
        });
        return reply.status(200).send({ message: "Post deleted successfully" });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    },
  );

  /* Interface for put data */
  interface PostBody {
    title: string;
    content: string;
  }

  /* Edit post */
  fastify.put<{ Params: { id: string }; Body: PostBody }>(
    "/posts/:id",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      try {
        /* Parse ID */
        const postId = parseInt(request.params.id as string);

        /* Check that ID is a number */
        if (isNaN(postId)) {
          return reply.status(400).send({ error: "Invalid post ID" });
        }

        /* Check if post exists */
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
          return reply.status(404).send({ error: "Post not found" });
        }

        /* Update post */
        const { title, content } = request.body;
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { title, content },
        });
        return reply.status(200).send(updatedPost);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    },
  );
}
