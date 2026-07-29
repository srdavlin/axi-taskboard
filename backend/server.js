// Thin HTTP backend: JSON API over the tasks table (sql/schema.sql), plus
// static hosting for the phase-2 frontend so browser and API share one
// origin (no CORS needed). See AGENTS.md phase plan for the backend-shape
// rationale.

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const PORT = process.env.PORT || 3001;

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://axitaskboard:axitaskboard-dev-only@localhost:5432/axitaskboard',
});

const STATUSES = ['open', 'in_progress', 'done'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function validateCreate(body) {
  if (typeof body.title !== 'string' || !body.title.trim()) {
    return 'title is required';
  }
  if (body.priority !== undefined && (!Number.isInteger(body.priority) || body.priority < 0 || body.priority > 3)) {
    return 'priority must be an integer 0-3';
  }
  return null;
}

function validateUpdate(body) {
  if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim())) {
    return 'title must be a non-empty string';
  }
  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    return `status must be one of ${STATUSES.join(', ')}`;
  }
  if (body.priority !== undefined && (!Number.isInteger(body.priority) || body.priority < 0 || body.priority > 3)) {
    return 'priority must be an integer 0-3';
  }
  return null;
}

async function serveStatic(req, res, pathname) {
  const rel = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(FRONTEND_DIR, rel);
  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  if (pathname === '/api/tasks' && req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at ASC');
    sendJson(res, 200, rows);
    return;
  }

  if (pathname === '/api/tasks' && req.method === 'POST') {
    let body;
    try {
      body = await readBody(req);
    } catch {
      sendJson(res, 400, { error: 'invalid JSON' });
      return;
    }
    const err = validateCreate(body);
    if (err) {
      sendJson(res, 400, { error: err });
      return;
    }
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, body, priority) VALUES ($1, $2, $3) RETURNING *',
      [body.title.trim(), body.body ?? null, body.priority ?? 0]
    );
    sendJson(res, 201, rows[0]);
    return;
  }

  const taskMatch = pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (taskMatch && (req.method === 'PATCH' || req.method === 'PUT')) {
    const id = Number(taskMatch[1]);
    let body;
    try {
      body = await readBody(req);
    } catch {
      sendJson(res, 400, { error: 'invalid JSON' });
      return;
    }
    const err = validateUpdate(body);
    if (err) {
      sendJson(res, 400, { error: err });
      return;
    }
    const fields = [];
    const values = [];
    for (const key of ['title', 'body', 'status', 'priority']) {
      if (body[key] !== undefined) {
        fields.push(`${key} = $${fields.length + 1}`);
        values.push(key === 'title' ? body.title.trim() : body[key]);
      }
    }
    if (fields.length === 0) {
      sendJson(res, 400, { error: 'no updatable fields provided' });
      return;
    }
    values.push(id);
    const { rows } = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (rows.length === 0) {
      sendJson(res, 404, { error: 'task not found' });
      return;
    }
    sendJson(res, 200, rows[0]);
    return;
  }

  if (taskMatch && req.method === 'DELETE') {
    const id = Number(taskMatch[1]);
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (rowCount === 0) {
      sendJson(res, 404, { error: 'task not found' });
      return;
    }
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname.startsWith('/api/')) {
    sendJson(res, 404, { error: 'not found' });
    return;
  }

  if (req.method === 'GET') {
    await serveStatic(req, res, pathname);
    return;
  }

  res.writeHead(405);
  res.end();
});

server.listen(PORT, () => {
  console.log(`axi-taskboard backend listening on http://localhost:${PORT}`);
});
