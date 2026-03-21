
// src/database/index.js

const { dbFile } = require("../../config/paths.js");

const DBManager = require('./dbManager');
const db = new DBManager(dbFile);

module.exports = db;