import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCache, setCache } from "../utils/cache";
import Joi from "joi";
import { errorHandler } from "../utils/errorHandler";
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY: any = process.env.SECRET_KEY;
const prisma = new PrismaClient();

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const userResolvers = {
  Query: {
    users: errorHandler(async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Access denied. Please log in.");
      }

      const cacheKey = "users";
      const cachedUsers = await getCache(cacheKey);
      if (cachedUsers) {
        console.log("Returning cached users");
        return cachedUsers;
      }

      const users = await prisma.user.findMany();
      await setCache(cacheKey, users, 3600); // Cache for 1 hour

      return users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),  
        updatedAt: user.updatedAt.toISOString(),  
      }));
      return users;
    }),
  },

  Mutation: {
    createUser: errorHandler(async (_: any, { email, password }: { email: string; password: string }, { io }: any) => {
      const { error } = userValidationSchema.validate({ email, password });
      if (error) {
        throw new Error(error.details[0].message);
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email is already taken. Please choose a different email.");
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword },
      });

      io.emit("newUser", { id: newUser.id, email: newUser.email });
      console.log("New user created and event emitted:", { id: newUser.id, email: newUser.email });

     
      return {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      };
    }),

    login: errorHandler(async (_: any, { email, password }: { email: string; password: string }) => {
      const { error } = userValidationSchema.validate({ email, password });
      if (error) {
        throw new Error(error.details[0].message);
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    }),

    clearUsers: async () => {
      try {
        
        await prisma.user.deleteMany();

        
        await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;

        return "All users deleted successfully, and ID sequence has been reset.";
      } catch (error) {
        console.error("Error clearing users:", error);
        throw new Error("Failed to clear users.");
      }
    },

    updateUser: errorHandler(async (_: any, { id, email }: { id: number; email: string }, { io }: any) => {
      const updatedUser = await prisma.user.update({
        where: {
          id: id, 
        },
        data: {
          email: email,  
        },
      });
      io.emit("userUpdated", { id: updatedUser.id, email: updatedUser.email });
      console.log("User updated and event emitted:", { id: updatedUser.id, email: updatedUser.email });

      return updatedUser;
    }),
  },
};
