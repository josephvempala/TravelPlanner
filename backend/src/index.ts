import { Hono } from "hono";
import { config } from "dotenv";
import attractions from "./routes/attraction";
import city from "./routes/city";

config();

const app = new Hono();

app.route("/api/v1/attractions", attractions);
app.route("/api/v1/cities", city);

export default app;
export type AppType = typeof app & typeof attractions;
