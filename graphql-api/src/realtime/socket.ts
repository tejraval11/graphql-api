import { Server as SocketIOServer, Socket as IOSocket } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY : any= process.env.SECRET_KEY;

interface CustomSocket extends IOSocket {
  user?: {
    id: number;
    email: string;
  };
}

export const configureSocket = (httpServer: any) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", 
    },
  });


  io.use((socket: CustomSocket, next) => {
    let token = socket.handshake.auth.token; 


if (!token) {
  return next(new Error("Authentication error: Token is required"));
}


token = token.replace("Bearer ", "").trim();

try {

  const user = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
  socket.user = user;
  console.log(`User authenticated: ${user.email}`);
  next();
} catch (err) {
  console.error("JWT Error:", err);
  return next(new Error("Authentication error: Invalid token"));
}
});

io.on("connection", (socket: CustomSocket) => {
console.log(`New client connected: ${socket.id}, User: ${socket.user?.email}`);


socket.on("joinRoom", (roomName: string) => {
  socket.join(roomName);
  console.log(`Socket ${socket.id} joined room: ${roomName}`);
});


socket.on("sendMessage", ({ roomName, message }: { roomName: string; message: string }) => {
  console.log(`Message from ${socket.user?.email} to room ${roomName}: ${message}`);
  io.to(roomName).emit("roomMessage", { message, from: socket.user?.email });
});


socket.on("newUser", (newUser: { id: number; email: string }) => {

  io.emit("userCreated", { id: newUser.id, email: newUser.email });
});


socket.on("disconnect", () => {
  console.log(`Client disconnected: ${socket.id}`);
});
});

return io;  
};