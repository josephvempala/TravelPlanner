import { Hono } from "hono";
import { config } from "dotenv";
import attractions from "./routes/attractions";

config();

const app = new Hono();

app.route("/api/v1/attractions", attractions);

export default app;
export type AppType = typeof app & typeof attractions;
