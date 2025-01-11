import express from "express";
import { fetchNews } from "../controllers/news.controller.js";

const router = express.Router();

router.get("/", fetchNews);

export default router;
