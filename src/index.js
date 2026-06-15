const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authMiddleware } = require('./middleware/auth.middleware');
const env = require('./config/env');

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await authMiddleware(req);
        return { user };
      },
    })
  );

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}/graphql`);
  });
}

startServer();
