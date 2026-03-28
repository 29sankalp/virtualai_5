import express from "express";
import { playYoutube } from "../controllers/youtubeControllers.js";

const router = express.Router();

router.post("/play", playYoutube);

export default router;