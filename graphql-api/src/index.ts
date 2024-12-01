import express from 'express';  // Import express
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { configureSocket } from './realtime/socket';  // Import configureSocket to initialize io
import { typeDefs } from './schema/user';
import { userResolvers } from './resolvers/user';
import { verifyToken } from './utils/auth';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY : any= process.env.SECRET_KEY; 

const app: any = express();  


const httpServer = createServer(app);


const io = configureSocket(httpServer);  


io.use((socket : any, next : any) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token is required"));
  }
  try {
    const user = jwt.verify(token, SECRET_KEY);
    socket.user = user; 
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});


const server = new ApolloServer({
  typeDefs,
  persistedQueries: false,
  resolvers: userResolvers,
  introspection: true,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = verifyToken(token.replace("Bearer ", ""));  
    return { user, io }; 
  },
});


server.start().then(() => {

  server.applyMiddleware({ app });

  httpServer.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`Socket.IO ready at http://localhost:4000`);
  });
});
