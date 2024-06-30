// Import the framework and instantiate it
import Fastify from "fastify";
import cors from "@fastify/cors";

import useTextileRoutes from "./routes/useTextileRoutes";

// Initialises database connection
import "./clients/database";

const fastify = Fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

fastify.register(useTextileRoutes, { prefix: "/textile" });

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

// Run the server!
async function main() {
  await fastify.register(cors, {
    // put your options here
  });
  try {
    const port = (process.env.PORT || 3000) as number;
    await fastify.listen({ port });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
