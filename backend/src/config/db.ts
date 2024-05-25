import { Database } from "sqlite3";
import { open } from "sqlite";
import { open as openFile } from "fs";
import { join } from "path";

// Define the path to the SQLite database file
const dbPath = join(
  __dirname,
  process.env.SQLITE_DATA_PATH || "../../db.sqlite"
);

openFile(dbPath, "w", (err) => {});

export async function connect() {
  const db = await open({
    filename: dbPath,
    driver: Database,
  });

  return db;
}

connect().then((db) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS city (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attractions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      rating REAL,
      city_id INTEGER References city(id)
    );
  `);
});
