import express from "express";
import { redirectUrl } from "../controllers/redirectUrl";
import { shortenUrl } from "../controllers/shortenUrl";
import { limiter } from "../middlewares/limiter";

const router = express.Router();

router.use(limiter);

router.post('/shorten', shortenUrl);
router.get('/:shortCode', redirectUrl);

export default router;