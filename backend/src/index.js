import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import newsRoutes from "./routes/news.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

// Global CORS middleware for routes requiring credentials
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Only these routes require credentials
  })
);

// Specific CORS middleware for /api/news without credentials
app.use("/api/news",newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
