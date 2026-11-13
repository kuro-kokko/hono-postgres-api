import { afterAll, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";

const jsonInit = (method: string, body: unknown) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

afterAll(async () => {
  await pool.end();
});

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});

describe("members CRUD", () => {
  const email = `test-${Date.now()}@example.com`;
  let id: number;

  afterAll(async () => {
    await pool.query("DELETE FROM app.members WHERE email = $1", [email]);
  });

  it("creates a member", async () => {
    const res = await app.request(
      "/members",
      jsonInit("POST", { name: "Test User", email }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({ name: "Test User", email });
    id = body.id;
  });

  it("gets the member", async () => {
    const res = await app.request(`/members/${id}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id, email });
  });

  it("rejects a duplicate email", async () => {
    const res = await app.request(
      "/members",
      jsonInit("POST", { name: "Another", email }),
    );
    expect(res.status).toBe(409);
  });

  it("updates the member", async () => {
    const res = await app.request(
      `/members/${id}`,
      jsonInit("PUT", { name: "Renamed", email }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id, name: "Renamed" });
  });

  it("deletes the member", async () => {
    const res = await app.request(`/members/${id}`, { method: "DELETE" });
    expect(res.status).toBe(204);
  });

  it("returns 404 after deletion", async () => {
    const res = await app.request(`/members/${id}`);
    expect(res.status).toBe(404);
  });
});

describe("validation", () => {
  it("returns 400 for a non-numeric id", async () => {
    const res = await app.request("/members/abc");
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid body", async () => {
    const res = await app.request(
      "/members",
      jsonInit("POST", { name: "", email: "not-an-email" }),
    );
    expect(res.status).toBe(400);
  });
});
