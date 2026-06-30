<!--
=============================================================
  DAY 2 ASSIGNMENT — TaskListView.vue (Parent Component)
  This file renders a list of TaskCard components.
=============================================================
-->
<script setup>
import { ref, computed } from 'vue'
import TaskCard from './TaskCard_day2.vue'

// TODO 1: tasks ref with sample data (Extension: priority field)
const tasks = ref([
  { id: 1, name: 'Finish Vue props lesson', done: false, dueDate: '2026-07-01', priority: 'High' },
  { id: 2, name: 'Review emits & slots', done: true,  dueDate: '2026-06-30', priority: 'Medium' },
  { id: 3, name: 'Build TaskCard component', done: false, dueDate: '2026-07-02', priority: 'Low' },
])

// TODO 2: toggle done for the matching task (parent owns the state)
function handleComplete(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
}

// TODO 3: remove the task with this id
function handleDelete(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

// Extension: apply an edited name coming up from the child via 'update'
function handleUpdate({ id, name }) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.name = name
}

// Progress summary — derived state for the header
const doneCount = computed(() => tasks.value.filter(t => t.done).length)
const totalCount = computed(() => tasks.value.length)
const percent = computed(() =>
  totalCount.value ? Math.round((doneCount.value / totalCount.value) * 100) : 0
)
</script>

<template>
  <div class="task-list-view">
    <header class="list-header">
      <div class="title-row">
        <h1>My Tasks</h1>
        <span class="count-pill">{{ doneCount }}/{{ totalCount }} done</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: percent + '%' }"></div>
      </div>
    </header>

    <!-- TODO 4: one TaskCard per task — props down, events up -->
    <TransitionGroup name="task" tag="div">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @complete="handleComplete"
        @delete="handleDelete"
        @update="handleUpdate"
      >
        <template #meta>
          Due: {{ task.dueDate }}
        </template>
      </TaskCard>
    </TransitionGroup>

    <p v-if="tasks.length === 0" class="empty">All tasks done! 🎉</p>
  </div>
</template>

<style scoped>
.task-list-view {
  width: 100%;
  max-width: 520px;
  margin: 40px auto;
  padding: 24px;
  box-sizing: border-box;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* ─── Header with progress summary ─── */
.list-header { margin-bottom: 32px; }
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
h1 {
  color: #1B2A4A;
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.01em;
}
.count-pill {
  background: #eef2f7;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
}
.progress-track {
  height: 8px;
  background: #eef2f7;
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42B883, #2f9e6d);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.empty {
  text-align: center;
  color: #aaa;
  font-style: italic;
  margin: 32px 0;
}

/* ─── List enter/leave/move transitions ─── */
.task-enter-from,
.task-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
.task-enter-active,
.task-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.task-leave-active {
  position: absolute;
  width: 100%;
}
.task-move {
  transition: transform 0.3s ease;
}
</style>
