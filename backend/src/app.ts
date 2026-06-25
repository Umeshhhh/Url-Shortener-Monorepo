import express from "express";
import urlRoutes from "./routes/urlRoutes";
import cors from "cors";
import { env } from "./config/env";

const app = express();

app.use(cors({
    origin: env.corsOrigins?.length ? env.corsOrigins : true
}));
app.use(express.json());
app.get('/health', (_req, res) => {
    res.status(200).json({ status: "ok" });
});
app.use('/', urlRoutes);

export default app;
