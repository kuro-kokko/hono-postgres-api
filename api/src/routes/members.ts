import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { pool } from "../db.js";

const idParam = z.object({ id: z.coerce.number().int().positive() });
const memberBody = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export const members = new Hono();

members.get("/", async (c) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, created_at FROM app.members ORDER BY id",
  );
  return c.json(rows);
});

members.get("/:id", zValidator("param", idParam), async (c) => {
  const { id } = c.req.valid("param");
  const { rows } = await pool.query(
    "SELECT id, name, email, created_at FROM app.members WHERE id = $1",
    [id],
  );
  if (rows.length === 0) {
    return c.json(
      { error: { code: "NOT_FOUND", message: "Member not found" } },
      404,
    );
  }
  return c.json(rows[0]);
});

members.post("/", zValidator("json", memberBody), async (c) => {
  const { name, email } = c.req.valid("json");
  const { rows } = await pool.query(
    "INSERT INTO app.members (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at",
    [name, email],
  );
  return c.json(rows[0], 201);
});
