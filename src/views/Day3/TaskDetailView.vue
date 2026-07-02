<!--
=============================================================
  DAY 3 ASSIGNMENT — TaskDetailView.vue
  Displays full details for a single task
=============================================================
-->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'

// TODO 1: Get the current route and router instances
const route  = useRoute()
const router = useRouter()

const taskStore = useTaskStore()

// TODO 2: Find the task matching the route param
// Remember: route.params.id is a STRING — cast to Number before comparing
const task = computed(() => taskStore.tasks.find(t => t.id === Number(route.params.id)))

// TODO 3: Write goBack() using router.push() to navigate to '/home'
function goBack() {
  router.push('/home')
}
</script>

<template>
  <div class="detail-view">

    <!-- TODO 4: Show this only if task is found (v-if="task") -->
    <div v-if="task" class="detail-card">
      <button class="back-btn" @click="goBack">← Back</button>

      <!-- TODO 5: Display task.name, task.dueDate, and task.done status -->
      <h1>{{ task.name }}</h1>

      <span class="badge" :class="task.done ? 'badge--done' : 'badge--pending'">
        {{ task.done ? 'Done' : 'Pending' }}
      </span>

      <dl class="meta">
        <div class="meta-row">
          <dt>Due</dt>
          <dd>{{ task.dueDate }}</dd>
        </div>
        <div class="meta-row" v-if="task.priority">
          <dt>Priority</dt>
          <dd>{{ task.priority }}</dd>
        </div>
      </dl>
    </div>

    <!-- This case is handled by the router guard, but good to have a fallback -->
    <div v-else class="not-found">
      <p>Task not found.</p>
      <button class="back-btn" @click="goBack">← Go Back</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  width: 100%;
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  color: #1b2a4a;
}

.detail-card { text-align: center; }

.back-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 13.5px;
  color: #475569;
  cursor: pointer;
  margin-bottom: 24px;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.back-btn:hover { border-color: #42b883; color: #42b883; }

h1 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 12px;
}

.badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
}
.badge--done { background: #dcfce7; color: #15803d; }
.badge--pending { background: #fef3c7; color: #92400e; }

.meta {
  margin: 24px 0 0;
  border-top: 1px solid #edf0f4;
}
.meta-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #edf0f4;
}
.meta dt { color: #94a3b8; font-size: 13.5px; }
.meta dd { margin: 0; font-size: 14.5px; font-weight: 600; }

.not-found { color: #64748b; }
.not-found p { margin: 0 0 16px; }
</style>
