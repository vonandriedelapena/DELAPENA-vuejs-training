<!--
=============================================================
  DAY 4 ASSIGNMENT — TaskListView.vue (refactored for Pinia)
  Remove all local state. Use the store for everything.
=============================================================
-->
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// TODO 1: Import your store  ✅
import { useTaskStore } from './taskStore'

// TODO 2: Get the store instance  ✅
const taskStore = useTaskStore()

// TODO 3: Destructure REACTIVE STATE using storeToRefs()  ✅
const { tasks, doneCount, pendingCount, totalCount } = storeToRefs(taskStore)

// TODO 4: Destructure ACTIONS directly (no storeToRefs needed for functions)  ✅
const { addTask, toggleTask, removeTask } = taskStore

// This local ref is fine — it's UI state, not task state
const newTaskName = ref('')

function handleAdd() {
  // TODO 5: Call addTask() from the store, then clear the input  ✅
  addTask(newTaskName.value)
  newTaskName.value = ''
}
</script>

<template>
  <div class="task-view">
    <header class="view-header">
      <h1>📝 Tasks</h1>
      <p class="subtitle">Day 4 — state lives in a Pinia store</p>
    </header>

    <!-- TODO 6: Display totalCount, doneCount, pendingCount from the store  ✅ -->
    <div class="stats">
      <span class="stat"><strong>{{ totalCount }}</strong> total</span>
      <span class="stat stat--done"><strong>{{ doneCount }}</strong> done</span>
      <span class="stat stat--pending"><strong>{{ pendingCount }}</strong> pending</span>
    </div>

    <div class="input-row">
      <input v-model="newTaskName" placeholder="New task..." @keyup.enter="handleAdd" />
      <button class="add-btn" @click="handleAdd">Add</button>
    </div>

    <!-- TODO 7: Render the task list using tasks from the store  ✅ -->
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ 'is-done': task.done }">
        <label class="check">
          <input type="checkbox" :checked="task.done" @change="toggleTask(task.id)" />
          <span class="box"><span v-if="task.done" class="tick">✓</span></span>
        </label>
        <span class="name" :class="{ done: task.done }">{{ task.name }}</span>
        <button class="remove" @click="removeTask(task.id)">Remove</button>
      </li>
    </ul>

    <p v-if="totalCount === 0" class="empty">No tasks yet. Add one above!</p>
  </div>
</template>

<style scoped>
.task-view {
  width: 100%;
  font-family: var(--vt-font);
  color: var(--vt-ink);
}

.view-header { margin-bottom: 24px; }
h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 4px;
}
.subtitle {
  color: var(--vt-muted);
  font-size: 14px;
}

/* ─── Stats bar ─── */
.stats {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.stat {
  flex: 1;
  text-align: center;
  padding: 10px 8px;
  background: var(--vt-row);
  border: 1px solid var(--vt-border);
  border-radius: var(--vt-radius);
  font-size: 13px;
  color: var(--vt-body);
}
.stat strong { display: block; font-size: 20px; color: var(--vt-ink); }
.stat--done strong { color: #15803d; }
.stat--pending strong { color: #b45309; }

/* ─── Add input ─── */
.input-row { display: flex; gap: 8px; margin-bottom: 20px; }
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
.add-btn {
  padding: 11px 20px;
  background: var(--vt-accent);
  color: #fff;
  border: none;
  border-radius: var(--vt-radius);
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.15s ease;
}
.add-btn:hover { background: var(--vt-accent-dark); }

/* ─── Task list ─── */
.task-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.task-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--vt-card);
  border: 1px solid var(--vt-border);
  border-radius: var(--vt-radius);
  box-shadow: var(--vt-shadow);
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.task-list li:hover {
  border-color: var(--vt-accent);
  box-shadow: var(--vt-shadow-hover);
  transform: translateY(-2px);
}
.task-list li.is-done { background: var(--vt-accent-soft); border-color: #bbf7d0; }

.check { position: relative; display: inline-flex; cursor: pointer; }
.check input { position: absolute; opacity: 0; width: 0; height: 0; }
.box {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.check input:checked + .box { background: #15803d; border-color: #15803d; }
.tick { color: #fff; font-size: 12px; font-weight: 700; line-height: 1; }

.name { flex: 1; min-width: 0; font-size: 15px; font-weight: 600; color: var(--vt-ink); }
.done { text-decoration: line-through; color: var(--vt-muted); font-weight: 500; }

.remove {
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
.remove:hover { background: #fecaca; }

.empty { text-align: center; color: var(--vt-muted); font-style: italic; margin: 32px 0; }
</style>
