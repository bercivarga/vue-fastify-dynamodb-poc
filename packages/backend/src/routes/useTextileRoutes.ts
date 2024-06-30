import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {
  getAllTextiles,
  createTextile,
  getTextileById,
  deleteTextile,
} from "../models/textile";
import { ensureTableExists } from "../models/ensureTextileTableExists";

export async function useTextileRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  await ensureTableExists();

  // Get all
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              textiles: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async function handler(request: FastifyRequest, reply: FastifyReply) {
      const textiles = await getAllTextiles();

      return {
        textiles,
      };
    }
  );

  // Get one
  fastify.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              textile: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async function handler(
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) {
      const textileId = request.params.id;

      const textile = await getTextileById(textileId);

      if (!textile) {
        reply.status(404);
        return {
          error: "Not found",
        };
      }

      return {
        textile,
      };
    }
  );

  // Create one
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
          },
          required: ["name", "description"],
        },
        response: {
          201: {
            type: "object",
            properties: {
              textile: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async function handler(
      request: FastifyRequest<{ Body: { name: string; description: string } }>,
      reply: FastifyReply
    ) {
      const { name, description } = request.body;

      const textile = await createTextile({
        name,
        description,
        id: Math.random().toString(36).substring(7),
      });

      reply.status(201);
      return {
        textile,
      };
    }
  );

  // Delete one
  fastify.delete(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
        },
        response: {
          204: {
            type: "object",
            properties: {
              success: { type: "boolean" },
            },
          },
        },
      },
    },
    async function handler(
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) {
      const textileId = request.params.id;

      await deleteTextile(textileId);

      reply.status(204);
      return {
        success: true,
      };
    }
  );
}

export default useTextileRoutes;
