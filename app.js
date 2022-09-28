import "express-async-errors";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import connectDB from "./db/connect.js";

import productRouter from "./routes/routes.js";

//middleware
app.use(express.json());

//routes

app.get("/", (req, res) => {
  res.send('<h1>Store Api</h1><a href="/api/v1/products">Product routes</a>');
});

app.use("/api/v1/products", productRouter);

//Product routes

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//server

const Port = process.env.Port || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(Port, console.log(`Server listening on ${Port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
