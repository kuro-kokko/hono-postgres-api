import { Hono } from "hono";
import { pool } from "../db.js";

export const members = new Hono();

members.get("/", async (c) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, created_at FROM app.members ORDER BY id",
  );
  return c.json(rows);
});
