import express from "express";
import userRouter from "./routes/user.route"
import { notFoundErrorHandler } from "./controllers/error.controller";
import { errorHandler } from "./middleware/error.middleware";


const app=express();


app.use(express.json());

app.use("/api/v1/user",userRouter);

app.all("*",notFoundErrorHandler)
app.use(errorHandler);

export default app;