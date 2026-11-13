import { Hono } from "hono";
import { logger } from "hono/logger";
import { members } from "./routes/members.js";

export const app = new Hono();

app.use(logger());

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/members", members);
