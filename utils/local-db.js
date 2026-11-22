import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "diary-db.json");

function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], entries: [] }, null, 2));
  }
}

export function getLocalDB() {
  ensureDB();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { users: [], entries: [] };
  }
}

export function saveLocalDB(data) {
  ensureDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

