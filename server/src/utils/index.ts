import bcrypt from "bcryptjs";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants";
import jwt from "jsonwebtoken"

export const hashPassword =async(password:string)=>{
      const hashedPassword= await bcrypt.hash(password,10);
      return hashedPassword;
}

export const isPasswordCorrect = async ({
      password,
      hashedPassword,
    }: {
      password: string;
      hashedPassword: string;
    }) => {
      const isCorrect = await bcrypt.compare(password, hashedPassword);
      return isCorrect;
    };
    
    export const generateAccessTokenAndRefreshToken = (userId: string) => {
      const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });
      const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });
      return { accessToken, refreshToken };
    };