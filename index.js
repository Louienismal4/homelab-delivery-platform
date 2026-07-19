const express = require("express");
const pool = require("./db");
const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/notes", async (req, res) => {
  const result = await pool.query("SELECT * FROM notes");
  res.json(result.rows);
});

app.post("/notes", async (req, res) => {
  const { content } = req.body;
  await pool.query("INSERT INTO notes (content) VALUES ($1)", [content]);
  res.status(201).send("Note added");
});

async function start() {
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, content TEXT)",
    );
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error(
      "Database connection failed. Start PostgreSQL locally or run `docker compose up --build`.",
    );
    console.error(error.message);
    process.exit(1);
  }
}

start();
