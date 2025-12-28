import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error-middleware.js";
import authRouter from "./router/auth-route.js";
import contentRouter from "./router/content-route.js";
import brainRouter from "./router/brain-route.js";
import cors from "cors";

export const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/content/", contentRouter);
app.use("/api/v1/brain/", brainRouter);

app.use(errorMiddleware);
