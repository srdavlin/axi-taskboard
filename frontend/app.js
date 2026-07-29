// Phase 3: wired to the backend API (see AGENTS.md phase plan) — fetches
// tasks from Postgres via /api/tasks and refetches after every mutation.

const STATUSES = ['open', 'in_progress', 'done'];
const STATUS_LABELS = { open: 'Open', in_progress: 'In Progress', done: 'Done' };
const PRIORITY_LABELS = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Urgent' };
const PRIORITY_VARIANTS = { 0: 'neutral', 1: 'brand', 2: 'warning', 3: 'danger' };

const API_BASE = '/api/tasks';

let tasks = [];

const toast = document.getElementById('toast');
const calloutFallback = document.getElementById('callout-fallback');
let calloutTimer = null;
const dialog = document.getElementById('task-dialog');
const titleInput = document.getElementById('task-title');
const bodyInput = document.getElementById('task-body');
const saveBtn = document.getElementById('task-save-btn');
const newTaskBtn = document.getElementById('new-task-btn');

let editingId = null;

function notify(message, variant = 'success') {
  // wa-toast is a Web Awesome Pro-only component and isn't defined on the free
  // CDN (see AGENTS.md). Fall back to a wa-callout banner when that's the case.
  if (customElements.get('wa-toast')) {
    toast.create(message, { variant, duration: 3000 });
    return;
  }
  clearTimeout(calloutTimer);
  calloutFallback.setAttribute('variant', variant);
  calloutFallback.textContent = message;
  calloutFallback.style.display = 'block';
  calloutTimer = setTimeout(() => {
    calloutFallback.style.display = 'none';
  }, 3000);
}

function nextStatus(status) {
  const i = STATUSES.indexOf(status);
  return i < STATUSES.length - 1 ? STATUSES[i + 1] : null;
}

function prevStatus(status) {
  const i = STATUSES.indexOf(status);
  return i > 0 ? STATUSES[i - 1] : null;
}

async function apiRequest(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function loadTasks() {
  try {
    tasks = await apiRequest(API_BASE);
    renderBoard();
  } catch (err) {
    notify(`Failed to load tasks: ${err.message}`, 'danger');
  }
}

function renderBoard() {
  for (const status of STATUSES) {
    const col = document.getElementById(`column-${status}`);
    col.innerHTML = '';
    const columnTasks = tasks.filter((t) => t.status === status);
    if (columnTasks.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No tasks';
      col.appendChild(empty);
      continue;
    }
    for (const task of columnTasks) {
      col.appendChild(renderCard(task));
    }
  }
}

function renderCard(task) {
  const card = document.createElement('wa-card');
  card.className = 'task-card';

  const heading = document.createElement('h3');
  heading.slot = 'header';
  heading.textContent = task.title;
  card.appendChild(heading);

  const badge = document.createElement('wa-badge');
  badge.slot = 'header-actions';
  badge.setAttribute('variant', PRIORITY_VARIANTS[task.priority]);
  badge.textContent = PRIORITY_LABELS[task.priority];
  card.appendChild(badge);

  if (task.body) {
    const body = document.createElement('p');
    body.textContent = task.body;
    card.appendChild(body);
  }

  const editBtn = document.createElement('wa-button');
  editBtn.slot = 'footer-actions';
  editBtn.setAttribute('appearance', 'outlined');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => openDialog(task));
  card.appendChild(editBtn);

  const deleteBtn = document.createElement('wa-button');
  deleteBtn.slot = 'footer-actions';
  deleteBtn.setAttribute('appearance', 'outlined');
  deleteBtn.setAttribute('variant', 'danger');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task));
  card.appendChild(deleteBtn);

  const prev = prevStatus(task.status);
  if (prev) {
    const backBtn = document.createElement('wa-button');
    backBtn.slot = 'footer-actions';
    backBtn.setAttribute('appearance', 'plain');
    backBtn.textContent = '← ' + STATUS_LABELS[prev];
    backBtn.addEventListener('click', () => moveTask(task.id, prev));
    card.appendChild(backBtn);
  }

  const next = nextStatus(task.status);
  if (next) {
    const nextBtn = document.createElement('wa-button');
    nextBtn.slot = 'footer-actions';
    nextBtn.setAttribute('appearance', 'plain');
    nextBtn.textContent = STATUS_LABELS[next] + ' →';
    nextBtn.addEventListener('click', () => moveTask(task.id, next));
    card.appendChild(nextBtn);
  }

  return card;
}

async function moveTask(id, status) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  try {
    await apiRequest(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    notify(`"${task.title}" moved to ${STATUS_LABELS[status]}`);
    await loadTasks();
  } catch (err) {
    notify(`Failed to move task: ${err.message}`, 'danger');
  }
}

async function deleteTask(task) {
  try {
    await apiRequest(`${API_BASE}/${task.id}`, { method: 'DELETE' });
    notify(`"${task.title}" deleted`);
    await loadTasks();
  } catch (err) {
    notify(`Failed to delete task: ${err.message}`, 'danger');
  }
}

function openDialog(task) {
  editingId = task ? task.id : null;
  titleInput.value = task ? task.title : '';
  bodyInput.value = task ? task.body || '' : '';
  dialog.label = task ? 'Edit Task' : 'New Task';
  dialog.open = true;
}

async function saveTask() {
  const title = titleInput.value.trim();
  if (!title) {
    notify('Title is required', 'danger');
    return;
  }
  const body = bodyInput.value.trim();

  try {
    if (editingId) {
      await apiRequest(`${API_BASE}/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      notify(`"${title}" updated`);
    } else {
      await apiRequest(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      notify(`"${title}" created`);
    }
    dialog.open = false;
    await loadTasks();
  } catch (err) {
    notify(`Failed to save task: ${err.message}`, 'danger');
  }
}

newTaskBtn.addEventListener('click', () => openDialog(null));
saveBtn.addEventListener('click', saveTask);

loadTasks();
