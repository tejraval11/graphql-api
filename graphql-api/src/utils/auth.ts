import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY : any= process.env.SECRET_KEY;
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
};
