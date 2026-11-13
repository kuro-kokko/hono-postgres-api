import { Hono } from "hono";
import { logger } from "hono/logger";
import { members } from "./routes/members.js";

export const app = new Hono();

app.use(logger());

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/members", members);

app.notFound((c) =>
  c.json({ error: { code: "NOT_FOUND", message: "route not Found" } }, 404),
);

app.onError((err, c) => {
  if ((err as { code?: string }).code === "23505") {
    return c.json(
      { error: { code: "CONFLICT", message: "email already exists" } },
      409,
    );
  }
  console.error(err);
  return c.json(
    { error: { code: "INTERNAL_ERROR", message: "internal server error" } },
    500,
  );
});
