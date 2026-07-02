<!--
=============================================================
  DAY 1 Task — Reactive Task Counter App
  Topic: Vue 3 Composition API (ref, computed, v-model, v-for)
  Time: 60 minutes
=============================================================

OBJECTIVE
---------
Build a reactive task management app that demonstrates Vue 3's
reactivity system. You will use ref(), computed(), v-model, v-for,
and event handling — the core building blocks of every Vue app.

WHAT TO BUILD
-------------
A single-file Vue component (this file) that:

  1. Has a text input + "Add Task" button to create new tasks.
  2. Displays the task list, each item with:
       - A checkbox to mark it as done
       - The task name (strike-through when done)
       - A "Remove" button
  3. Shows a live stats bar:
       Total Tasks | Done: X | Pending: X
  4. Shows an empty state message when there are no tasks.

REQUIREMENTS (Acceptance Criteria)
------------------------------------
  [x] Use ref() for the text input value
  [x] Use ref() for the tasks array
  [x] Use computed() for total, done, and pending counts
  [x] Use v-model on the text input
  [x] Use v-for with :key to render the task list
  [x] Use @keyup.enter on the input to also trigger addTask
  [x] Prevent adding empty/whitespace-only tasks
  [x] Clear the input after adding a task

EXTENSION (Additional Points)
---------------------------------
  - Add a filter bar: All | Done | Pending — filters the visible list
  - Add a "Clear All Done" button that removes all completed tasks
  - Add a task priority: Low / Medium / High (use a <select> dropdown)

HINTS (read only if stuck)
---------------------------
  Hint 1: import { ref, computed } from 'vue'
  Hint 2: tasks.value.push({ id: Date.now(), name: '...', done: false })
  Hint 3: computed(() => tasks.value.filter(t => t.done).length)
  Hint 4: For :class strikethrough — :class="{ done: task.done }"
  Hint 5: v-model on a checkbox binds to a boolean — v-model="task.done"
  Hint 6: To prevent empty tasks — if (!newTaskName.value.trim()) return

FILE STRUCTURE (this is a single-file component)
-------------------------------------------------
  <script setup>  — all your reactive logic goes here
  <template>      — your HTML markup
  <style scoped>  — your CSS (scoped = only applies to this component)
=============================================================
-->

<script setup>
import { ref, computed } from 'vue'

// TODO 1: Create a ref for the text input value (initial value: '')
const newTaskName = ref('')

// Extension: ref for the currently-selected priority of the task being added
const newTaskPriority = ref('Medium')

// Extension: ref for the active filter — 'all' | 'done' | 'pending'
const filter = ref('all')

// TODO 2: Create a ref for the tasks array (initial value: [])
const tasks = ref([])

// TODO 3: Create computed() values for total, done, and pending counts
const totalCount = computed(() => tasks.value.length)
const doneCount = computed(() => tasks.value.filter(t => t.done).length)
const pendingCount = computed(() => totalCount.value - doneCount.value)

// Extension: the list that is actually shown, after applying the filter
const visibleTasks = computed(() => {
  if (filter.value === 'done') return tasks.value.filter(t => t.done)
  if (filter.value === 'pending') return tasks.value.filter(t => !t.done)
  return tasks.value
})

// TODO 4: Write the addTask() function
// - Prevent empty tasks
// - Push a new task object to tasks.value: { id, name, done }
// - Clear the input
function addTask() {
  const name = newTaskName.value.trim()
  if (!name) return

  tasks.value.push({
    id: Date.now(),
    name,
    done: false,
    priority: newTaskPriority.value,
  })

  newTaskName.value = ''
  newTaskPriority.value = 'Medium'
}

// TODO 5: Write toggleTask(id) — flip task.done for the matching task
function toggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
}

// TODO 6: Write removeTask(id) — filter out the task with this id
function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

// Extension: remove every completed task at once
function clearAllDone() {
  tasks.value = tasks.value.filter(t => !t.done)
}
</script>

<template>
  <div class="app">
    <h1>Task Counter</h1>

    <!-- TODO 7: input with v-model, @keyup.enter, placeholder -->
    <!-- TODO 8: "Add Task" button with @click="addTask" -->
    <div class="input-row">
      <input
        v-model="newTaskName"
        @keyup.enter="addTask"
        placeholder="What needs to be done?"
      />
      <select v-model="newTaskPriority" class="priority-select">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button @click="addTask">Add Task</button>
    </div>

    <!-- TODO 9: stats bar using computed values -->
    <div class="stats">
      Total: {{ totalCount }} | Done: {{ doneCount }} | Pending: {{ pendingCount }}
    </div>

    <!-- Extension: filter bar + clear-all-done -->
    <div class="filter-row">
      <div class="filters">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
        <button :class="{ active: filter === 'done' }" @click="filter = 'done'">Done</button>
        <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">Pending</button>
      </div>
      <button class="clear-done" :disabled="doneCount === 0" @click="clearAllDone">
        Clear All Done
      </button>
    </div>

    <!-- TODO 10: empty state — only when there are no tasks at all -->
    <p v-if="totalCount === 0" class="empty">No tasks yet. Add one above!</p>

    <!-- Empty state for an active filter that has no matches -->
    <p v-else-if="visibleTasks.length === 0" class="empty">
      No {{ filter }} tasks.
    </p>

    <!-- TODO 11: render the task list using v-for -->
    <ul v-else class="task-list">
      <li v-for="task in visibleTasks" :key="task.id">
        <input type="checkbox" v-model="task.done" />
        <span :class="{ done: task.done }">{{ task.name }}</span>
        <span class="badge" :class="task.priority.toLowerCase()">{{ task.priority }}</span>
        <button @click="removeTask(task.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  font-family: var(--vt-font);
  color: var(--vt-ink);
}

h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 20px;
}

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.input-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--vt-border);
  border-radius: var(--vt-radius);
  font-size: 14px;
  font-family: inherit;
  color: var(--vt-ink);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.input-row input:focus {
  border-color: var(--vt-accent);
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}

.priority-select {
  padding: 11px 12px;
  border: 1px solid var(--vt-border);
  border-radius: var(--vt-radius);
  font-size: 14px;
  font-family: inherit;
  background: var(--vt-card);
  color: var(--vt-ink);
  cursor: pointer;
}

.input-row button {
  padding: 11px 18px;
  background: var(--vt-accent);
  color: #fff;
  border: none;
  border-radius: var(--vt-radius);
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.15s ease;
}
.input-row button:hover { background: var(--vt-accent-dark); }

.stats {
  font-size: 13px;
  color: var(--vt-body);
  margin-bottom: 16px;
  padding: 10px 14px;
  background: var(--vt-accent-soft);
  border: 1px solid #d7f0e3;
  border-radius: var(--vt-radius);
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  gap: 6px;
}

.filters button {
  padding: 6px 14px;
  background: var(--vt-card);
  border: 1px solid var(--vt-border);
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--vt-body);
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.filters button.active {
  background: var(--vt-accent);
  color: #fff;
  border-color: var(--vt-accent);
}

.clear-done {
  padding: 6px 14px;
  background: var(--vt-danger-bg);
  color: var(--vt-danger);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.clear-done:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty {
  text-align: center;
  color: var(--vt-muted);
  font-style: italic;
  margin: 32px 0;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--vt-card);
  border-radius: var(--vt-radius);
  border: 1px solid var(--vt-border);
  box-shadow: var(--vt-shadow);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.task-list li:hover {
  border-color: var(--vt-accent);
  box-shadow: var(--vt-shadow-hover);
  transform: translateY(-2px);
}

.task-list li span {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--vt-ink);
}

/* Apply this class to task names when task.done is true */
.done {
  text-decoration: line-through;
  color: var(--vt-muted);
  font-weight: 500;
}

.badge {
  flex: none !important;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.badge.low    { background: #e0f2fe; color: #0369a1; }
.badge.medium { background: #fef9c3; color: #a16207; }
.badge.high   { background: #fee2e2; color: #dc2626; }

.task-list li button {
  padding: 6px 12px;
  background: var(--vt-danger-bg);
  color: var(--vt-danger);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  transition: background 0.15s ease;
}
.task-list li button:hover { background: #fecaca; }
</style>
