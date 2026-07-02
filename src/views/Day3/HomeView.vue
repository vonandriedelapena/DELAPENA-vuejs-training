<!--
=============================================================
  DAY 3 ASSIGNMENT — HomeView.vue
  Shows the task list with router-link navigation to each task
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()
const route     = useRoute()

// TODO 1: Read route.query.error — if it equals 'notfound', show a warning banner
const showErrorBanner = computed(() => route.query.error === 'notfound')
</script>

<template>
  <div class="home-view">
    <h1>📝 My Tasks</h1>

    <!-- TODO 2: Show a warning banner if showErrorBanner is true -->
    <div class="error-banner" v-if="showErrorBanner">
      ⚠️ Task not found. Redirected back to home.
    </div>

    <nav class="page-nav">
      <!-- TODO 3: Add a RouterLink to /about -->
      <RouterLink to="/about">About</RouterLink>
    </nav>

    <!-- TODO 4: Render each task as a RouterLink to /task/:id -->
    <ul class="task-list">
      <li v-for="task in taskStore.tasks" :key="task.id">
        <!-- TODO 5: Wrap this in a RouterLink -->
        <RouterLink :to="`/task/${task.id}`" class="task-link" :class="{ 'task-link--done': task.done }">
          <span class="check" :class="{ 'check--done': task.done }">
            <span v-if="task.done" class="tick">✓</span>
          </span>
          <span class="task-name" :class="{ done: task.done }">{{ task.name }}</span>
          <span class="chevron">›</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  color: #1b2a4a;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-align: center;
  margin: 0 0 8px;
}

.error-banner {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 11px 14px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #92400e;
  font-size: 13.5px;
}

.page-nav { text-align: center; margin-bottom: 28px; }
.page-nav a {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}
.page-nav a:hover { text-decoration: underline; }

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #edf0f4;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--vt-shadow);
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.task-link:hover {
  border-color: #42b883;
  background: #fafffc;
  box-shadow: var(--vt-shadow-hover);
  transform: translateY(-2px);
}
.task-link--done { background: #f0fdf4; border-color: #bbf7d0; }
.task-link--done:hover { border-color: #42b883; }

.check {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.check--done { background: #15803d; border-color: #15803d; }
.tick { color: #fff; font-size: 12px; font-weight: 700; line-height: 1; }

.task-name { flex: 1; min-width: 0; font-size: 15px; font-weight: 600; }
.done { text-decoration: line-through; color: #9ca3af; font-weight: 500; }

.chevron {
  color: #cbd5e1;
  font-size: 20px;
  line-height: 1;
  transition: color 0.15s ease, transform 0.15s ease;
}
.task-link:hover .chevron { color: #42b883; transform: translateX(2px); }
</style>
