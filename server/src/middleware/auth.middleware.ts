import { NextFunction,Request,Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ErrorCode } from "../constants";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma=new PrismaClient()

export const authUser = async (
      req: Request,
      _: Response,
      next: NextFunction
    ) => {
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!accessToken) {
        throw new ApiError(
          401,
          "Unauthorized request!",
          ErrorCode.UNAUTHORIZED_ACCESS
        );
      }
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as { userId: string };
    
      const user = await prisma.user.findFirst({where:{id:decodedToken.userId}});
      if (!user) {
        throw new ApiError(400, "User not found!", ErrorCode.USER_NOT_FOUND);
      }
      req.headers["userId"] = user.id.toString();
      next();
    };