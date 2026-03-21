const fs = require('fs');
const initSqlJs = require('sql.js');
const { dbFile } = require("../../config/paths.js");

class DBManager {
  constructor(dbFile = dbFile) {
    this.dbFile = dbFile;
    this.db = null;
  }

  // Initialize the database
  async init() {
    const SQL = await initSqlJs();

    if (fs.existsSync(this.dbFile)) {
      // Load existing DB
      const fileBuffer = fs.readFileSync(this.dbFile);
      this.db = new SQL.Database(fileBuffer);
    } else {
      // Create new DB
      this.db = new SQL.Database();
    }

    // Create tables if they don't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        data TEXT
      );
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT,
        jid TEXT
      );
      CREATE TABLE IF NOT EXISTS configs (
        key TEXT PRIMARY KEY,
        value TEXT
      );
      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY,
        data TEXT
      );
    `);

    console.log('Database initialized!');
  }

  // Save DB to file
  save() {
    console.log("Saving db...");
    const data = this.db.export();
    fs.writeFileSync(this.dbFile, Buffer.from(data));
    console.log("Saved db successfully.");
  }

  // ---------------- USERS ----------------
  addUser(id, name, data = {}) {
    const stmt = this.db.prepare(`INSERT OR REPLACE INTO users (id, name, data) VALUES (?, ?, ?)`);
    stmt.run([id, name, JSON.stringify(data)]);
    stmt.free();
    this.save();
  }

  getUser(id) {
    const res = this.db.exec(`SELECT * FROM users WHERE id='${id}'`);
    if (res.length === 0) return null;
    const row = res[0].values[0];
    return { id: row[0], name: row[1], data: JSON.parse(row[2]) };
  }
  
  // ---------------- USERS ----------------
    updateUser(id, newData) {
        const stmt = this.db.prepare(`UPDATE users SET data = ? WHERE id = ?`);
        stmt.run([JSON.stringify(newData), id]);
        stmt.free();
        this.save();
    }

  // ---------------- GROUPS ----------------
  addGroup(id, name, jid) {
    const stmt = this.db.prepare(`INSERT OR REPLACE INTO groups (id, name, jid) VALUES (?, ?, ?)`);
    stmt.run([id, name, jid]);
    stmt.free();
    this.save();
  }

  getGroup(id) {
    const res = this.db.exec(`SELECT * FROM groups WHERE id='${id}'`);
    if (res.length === 0) return null;
    const row = res[0].values[0];
    return { id: row[0], name: row[1], jid: row[2] };
  }

  getAllGroups() {
    const res = this.db.exec(`SELECT * FROM groups`);
    if (res.length === 0) return [];
    return res[0].values.map(row => ({ id: row[0], name: row[1], jid: row[2] }));
  }

  // ---------------- CONFIG ----------------
  setConfig(key, value) {
    const stmt = this.db.prepare(`INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)`);
    stmt.run([key, JSON.stringify(value)]);
    stmt.free();
    this.save();
  }

  getConfig(key) {
    const res = this.db.exec(`SELECT * FROM configs WHERE key='${key}'`);
    if (res.length === 0) return null;
    return JSON.parse(res[0].values[0][1]);
  }
}

module.exports = DBManager;