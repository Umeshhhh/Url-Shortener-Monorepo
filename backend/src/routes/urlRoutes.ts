import express from "express";
import { accessProtectedUrl, redirectUrl, resolveUrl } from "../controllers/redirectUrl";
import { shortenUrl } from "../controllers/shortenUrl";
import { limiter } from "../middlewares/limiter";
import { protectedUrl } from "../controllers/protectedUrl";

const router = express.Router();

router.use(limiter);

router.post('/shorten', shortenUrl);
router.get('/isProtected/:shortCode', protectedUrl);
router.get('/resolve/:shortCode', resolveUrl);
router.post('/:shortCode/access', accessProtectedUrl);
router.get('/:shortCode', redirectUrl);

export default router;
