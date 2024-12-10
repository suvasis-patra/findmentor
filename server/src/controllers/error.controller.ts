import { NextFunction,Request,Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { ErrorCode } from "../constants"

export const notFoundErrorHandler=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
      const error=new ApiError(404,"Not Found!",ErrorCode.RESOURCE_NOT_FOUND)
      next(error);
})