// functions/index.js
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();

// ★ これで直叩き(5001)でもCORS許可。開発中は origin:true でOK
app.use(cors({ origin: true }));

app.get('/ping', (req, res) => res.json({ ok: true }));

// ★ この1行が無いと関数が公開されません（region は asia-northeast1）
exports.api = functions.region('asia-northeast1').https.onRequest(app);
