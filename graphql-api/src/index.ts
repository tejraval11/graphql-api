import express from 'express';  // Import express
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { configureSocket } from './realtime/socket';  // Import configureSocket to initialize io
import { typeDefs } from './schema/user';
import { userResolvers } from './resolvers/user';
import { verifyToken } from './utils/auth';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();  // This loads the environment variables from the .env file

const SECRET_KEY : any= process.env.SECRET_KEY;  // Now you can access process.env.SECRET_KEY

const app: any = express();  // Initialize express app

// Create HTTP server from Express app
const httpServer = createServer(app);

// Initialize Socket.IO with Express server using configureSocket
const io = configureSocket(httpServer);  // Use configureSocket to set up io

// Middleware for JWT Authentication in Socket.IO
io.use((socket : any, next : any) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token is required"));
  }
  try {
    const user = jwt.verify(token, SECRET_KEY); // Use a secure key in production
    socket.user = user; // Attach user details to the socket object
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

// Initialize Apollo Server with Express
const server = new ApolloServer({
  typeDefs,
  persistedQueries: false,
  resolvers: userResolvers,
  introspection: true,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = verifyToken(token.replace("Bearer ", ""));  // Verify token
    return { user, io };  // Pass io to context
  },
});

// Start Apollo Server
server.start().then(() => {
  // Apply Apollo Server middleware to the Express app
  server.applyMiddleware({ app });

  // Start the server with Socket.IO and Apollo
  httpServer.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`Socket.IO ready at http://localhost:4000`);
  });
});
