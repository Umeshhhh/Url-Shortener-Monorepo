import "dotenv/config";
import app from "./app";
import { env, validateEnv } from "./config/env";

validateEnv();

app.listen(env.port, "0.0.0.0", () => {
    console.log(`Server is running on port ${env.port}`);
});
