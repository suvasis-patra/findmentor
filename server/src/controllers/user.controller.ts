import { Request,Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ErrorCode } from "../constants";
import { ApiResponse } from "../utils/ApiResponse";
import { UserSchema } from "../utils/validation";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils";

const prisma =new PrismaClient()

export const registerUser=asyncHandler(async (req: Request, res: Response) => {
      const userData = req.body;
      const validateUser = UserSchema.safeParse(userData);
      if (!validateUser.success) {
        throw new ApiError(400, "validation error", ErrorCode.VALIDATION_FAILED);
      }
      const { name, email, password } = validateUser.data;
      const existingUser = await prisma.user.findUnique({where:{email}});
      if (existingUser) {
        throw new ApiError(400, "Email already exist", ErrorCode.EMAIL_EXIST);
      }
      const hashedPassword= await hashPassword(password)
      const user = await prisma.user.create({
            data:{
                  name,
                  email,
                  password:hashedPassword
            }
      })
  
      res.status(201).json(new ApiResponse(201, user.id, "user registered!"));
    })