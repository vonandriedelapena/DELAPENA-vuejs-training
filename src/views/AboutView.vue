<!--
=============================================================
  DAY 3 — AboutView.vue
  Static info page reached via the /about route
=============================================================
-->
<script setup>
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()
</script>

<template>
  <div class="about-view">
    <RouterLink to="/home" class="back-link">← Back to tasks</RouterLink>
    <h1>About This App</h1>
    <p>A small task manager built while learning Vue Router — dynamic routes, query params, and navigation guards.</p>
    <p class="stat">Currently tracking {{ taskStore.totalCount }} task(s), {{ taskStore.doneCount }} done.</p>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 520px;
  margin: 48px auto;
  padding: 0 20px;
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  color: #1b2a4a;
}

.back-link {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 24px;
}
.back-link:hover { text-decoration: underline; }

h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 12px;
}

p {
  color: #4a5568;
  font-size: 15px;
  line-height: 1.6;
  margin: 8px 0;
}

.stat {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #edf0f4;
  color: #1b2a4a;
  font-weight: 600;
}
</style>
