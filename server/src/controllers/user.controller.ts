import { Request,Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ErrorCode } from "../constants";
import { ApiResponse } from "../utils/ApiResponse";
import { UserLoginSchema, UserSchema } from "../utils/validation";
import { PrismaClient } from "@prisma/client";
import { generateAccessTokenAndRefreshToken, hashPassword, isPasswordCorrect } from "../utils";

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
  
      res.status(201).json(new ApiResponse(201, {userId:user.id}, "user registered!"));
    })

    export const loginUser = asyncHandler(async (req: Request, res: Response) => {
      const userData = req.body;
      const validateUser = UserLoginSchema.safeParse(userData);
      if (!validateUser.success) {
        throw new ApiError(400, "validation error", ErrorCode.VALIDATION_FAILED);
      }
      const { email, password } = validateUser.data;
      const existingUser = await prisma.user.findUnique({where:{ email }});
      if (!existingUser) {
        throw new ApiError(400, "User not found", ErrorCode.USER_NOT_FOUND);
      }
      const isCorrect = await isPasswordCorrect({
        password,
        hashedPassword: existingUser.password,
      });
      if (!isCorrect) {
        throw new ApiError(
          401,
          "Unauthorized request",
          ErrorCode.UNAUTHORIZED_ACCESS
        );
      }
      const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken(
        existingUser.id
      );
      console.log(accessToken,refreshToken,"hello")
      const user = await prisma.user.update({
        where:{id:existingUser.id},
        data:{...(refreshToken && {refreshToken})}});
      if (!user) {
        throw new ApiError(400, "User not found", ErrorCode.USER_NOT_FOUND);
      }
    
      const options = {
        httpOnly: true,
        secure: true,
      };
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              userId: user.id,
              accessToken,
              refreshToken,
            },
            "User logged In Successfully"
          )
        );
    });

    export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
      const userId = req.headers["userId"] as string;
      if (!userId) {
        throw new ApiError(400, "User not found", ErrorCode.USER_NOT_FOUND);
      }
    
      // Update the user record in Prisma
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: undefined },
      });
    
      const options = {
        httpOnly: true,
        secure: true,
      };
    
      res
        .status(204)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(204, null, "logged out!"));
    });