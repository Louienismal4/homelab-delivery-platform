const express = require("express");
const pool = require("./db");
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/notes", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes");
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to get notes:", error.message);
    res.status(503).json({ error: "Database unavailable" });
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { content } = req.body;
    await pool.query("INSERT INTO notes (content) VALUES ($1)", [content]);
    res.status(201).send("Note added");
  } catch (error) {
    console.error("Failed to add note:", error.message);
    res.status(503).json({ error: "Database unavailable" });
  }
});

app.get("/ready", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ready" });
  } catch (error) {
    console.error("Readiness check failed:", error);
    res.status(503).json({ status: "not ready" });
  }
});
async function initializeDatabase() {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, content TEXT)",
  );
}

async function start() {
  try {
    await initializeDatabase();
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

start();
