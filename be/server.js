import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import { schema } from "./app/schema";

const PORT = 4000;
const app = express();

const server = new ApolloServer({
  schema
});

server.applyMiddleware({
  app
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running at ${PORT}${server.graphqlPath} `);
  console.log(
    `Subscriptions at ws://localhost:${PORT}${server.subscriptionsPath} `
  );
});
