// Phase 2 scaffold: static/mock data only. No backend wiring (see AGENTS.md phase plan).

const STATUSES = ['open', 'in_progress', 'done'];
const STATUS_LABELS = { open: 'Open', in_progress: 'In Progress', done: 'Done' };
const PRIORITY_LABELS = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Urgent' };
const PRIORITY_VARIANTS = { 0: 'neutral', 1: 'brand', 2: 'warning', 3: 'danger' };

let nextId = 6;
let tasks = [
  { id: 1, title: 'Set up dev environment', body: 'Install pg-axi and verify DATABASE_URL.', status: 'open', priority: 1, created_at: '2026-07-20T09:00:00Z', updated_at: '2026-07-20T09:00:00Z' },
  { id: 2, title: 'Design task schema', body: 'Match spec data model: title, body, status, priority.', status: 'open', priority: 2, created_at: '2026-07-21T10:00:00Z', updated_at: '2026-07-21T10:00:00Z' },
  { id: 3, title: 'Apply sql/schema.sql', body: 'Run via pg-axi query --file sql/schema.sql --execute.', status: 'in_progress', priority: 2, created_at: '2026-07-22T11:00:00Z', updated_at: '2026-07-24T14:00:00Z' },
  { id: 4, title: 'Scaffold Web Awesome frontend', body: 'Three-column board with mock data.', status: 'in_progress', priority: 3, created_at: '2026-07-23T12:00:00Z', updated_at: '2026-07-29T08:00:00Z' },
  { id: 5, title: 'Write project spec', body: 'Document architecture and AXI principles.', status: 'done', priority: 1, created_at: '2026-07-18T09:00:00Z', updated_at: '2026-07-19T09:00:00Z' },
];

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

function moveTask(id, status) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.status = status;
  task.updated_at = new Date().toISOString();
  renderBoard();
  notify(`"${task.title}" moved to ${STATUS_LABELS[status]}`);
}

function openDialog(task) {
  editingId = task ? task.id : null;
  titleInput.value = task ? task.title : '';
  bodyInput.value = task ? task.body || '' : '';
  dialog.label = task ? 'Edit Task' : 'New Task';
  dialog.open = true;
}

function saveTask() {
  const title = titleInput.value.trim();
  if (!title) {
    notify('Title is required', 'danger');
    return;
  }
  const body = bodyInput.value.trim();
  const now = new Date().toISOString();

  if (editingId) {
    const task = tasks.find((t) => t.id === editingId);
    task.title = title;
    task.body = body;
    task.updated_at = now;
    notify(`"${title}" updated`);
  } else {
    tasks.push({
      id: nextId++,
      title,
      body,
      status: 'open',
      priority: 0,
      created_at: now,
      updated_at: now,
    });
    notify(`"${title}" created`);
  }

  dialog.open = false;
  renderBoard();
}

newTaskBtn.addEventListener('click', () => openDialog(null));
saveBtn.addEventListener('click', saveTask);

renderBoard();
