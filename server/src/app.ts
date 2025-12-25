import express, { type Express } from "express";
import cookiePaser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRouter from "./router/userRoute.js";
import cors from "cors";

export const app: Express = express();

app.use(express.json());
app.use(cookiePaser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/auth/", authRouter);
// app.use("/api/v1/content/", )

app.use(errorMiddleware);
