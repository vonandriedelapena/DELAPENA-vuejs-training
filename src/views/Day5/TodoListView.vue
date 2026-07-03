<!--
=============================================================
  DAY 5 ASSIGNMENT — TodoListView.vue
  Uses useFetch() to load and display todos from JSONPlaceholder
=============================================================
-->
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from './useFetch'

const filter = ref('all') // 'all' | 'done' | 'pending'

// TODO 1: Call useFetch with the JSONPlaceholder todos endpoint  ✅
// Rename 'data' to 'todos' using destructuring alias syntax
const { data: todos, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/todos')

// TODO 2: filteredTodos computed — guard against null, limit to first 10, filter by status  ✅
const filteredTodos = computed(() => {
  if (!todos.value) return []
  const firstTen = todos.value.slice(0, 10)
  if (filter.value === 'done')    return firstTen.filter(t => t.completed)
  if (filter.value === 'pending') return firstTen.filter(t => !t.completed)
  return firstTen
})
</script>

<template>
  <div class="todo-view">
    <header class="view-header">
      <h1>📋 Todo List</h1>
      <p class="subtitle">Loaded from the JSONPlaceholder API via useFetch()</p>
    </header>

    <!-- TODO 3: Loading state -->
    <div v-if="loading" class="loading">
      <span class="spinner" aria-hidden="true"></span>
      <span>Loading todos…</span>
    </div>

    <!-- TODO 4: Error state (with Retry extension) -->
    <div v-else-if="error" class="error-box">
      <p class="error-title">⚠️ Couldn't load todos</p>
      <p class="error-msg">{{ error }}</p>
      <button class="retry-btn" @click="refetch">Retry</button>
    </div>

    <!-- TODO 5: Success content -->
    <div v-else>
      <!-- TODO 6: Filter buttons -->
      <div class="filters">
        <button :class="{ active: filter === 'all' }"     @click="filter = 'all'">All</button>
        <button :class="{ active: filter === 'done' }"    @click="filter = 'done'">Done</button>
        <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">Pending</button>
      </div>

      <!-- TODO 7: Render filteredTodos (checkbox is disabled — it reflects API data) -->
      <ul class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo.id" :class="{ 'done-item': todo.completed }">
          <input type="checkbox" :checked="todo.completed" disabled />
          <span class="title" :class="{ 'completed-text': todo.completed }">{{ todo.title }}</span>
        </li>
      </ul>

      <p v-if="filteredTodos.length === 0" class="empty">No {{ filter }} todos.</p>

      <!-- TODO 8: Visible count -->
      <p v-else class="count">Showing {{ filteredTodos.length }} item(s)</p>
    </div>
  </div>
</template>

<style scoped>
.todo-view {
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
.subtitle { color: var(--vt-muted); font-size: 14px; }

/* ─── Loading ─── */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 56px 0;
  color: var(--vt-accent);
  font-size: 15px;
  font-weight: 600;
}
.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid var(--vt-border);
  border-top-color: var(--vt-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Error ─── */
.error-box {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: var(--vt-radius);
  padding: 20px;
  text-align: center;
}
.error-title { color: #b91c1c; font-weight: 700; margin: 0 0 4px; }
.error-msg { color: #dc2626; font-size: 13.5px; margin: 0 0 16px; }
.retry-btn {
  padding: 9px 22px;
  background: var(--vt-accent);
  color: #fff;
  border: none;
  border-radius: var(--vt-radius);
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.15s ease;
}
.retry-btn:hover { background: var(--vt-accent-dark); }

/* ─── Filters ─── */
.filters { display: flex; gap: 6px; margin-bottom: 16px; }
.filters button {
  padding: 6px 16px;
  border: 1px solid var(--vt-border);
  border-radius: 999px;
  background: var(--vt-card);
  color: var(--vt-body);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.filters button.active {
  background: var(--vt-accent);
  color: #fff;
  border-color: var(--vt-accent);
}

/* ─── List ─── */
.todo-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.todo-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--vt-card);
  border: 1px solid var(--vt-border);
  border-radius: var(--vt-radius);
  font-size: 15px;
  box-shadow: var(--vt-shadow);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.todo-list li:hover {
  border-color: var(--vt-accent);
  box-shadow: var(--vt-shadow-hover);
  transform: translateY(-2px);
}
.todo-list li.done-item { background: var(--vt-accent-soft); border-color: #bbf7d0; }
.todo-list li input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #15803d;
  flex: 0 0 auto;
}

.title { flex: 1; min-width: 0; font-weight: 600; color: var(--vt-ink); }
.completed-text { text-decoration: line-through; color: var(--vt-muted); font-weight: 500; }

.empty { text-align: center; color: var(--vt-muted); font-style: italic; margin: 28px 0; }
.count { font-size: 13px; color: var(--vt-muted); margin-top: 14px; text-align: right; }
</style>
