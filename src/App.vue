<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'

const days = [
  { to: '/day1', label: 'Day 1', hint: 'Reactivity' },
  { to: '/day2', label: 'Day 2', hint: 'Components' },
  { to: '/home', label: 'Day 3', hint: 'Router' },
  { to: '/day4', label: 'Day 4', hint: 'Pinia' },
]
</script>

<template>
  <nav class="day-nav">
    <div class="nav-inner">
      <RouterLink to="/home" class="brand">
        <span class="brand-mark">V</span>
        <span class="brand-text">Vue Training</span>
      </RouterLink>

      <div class="day-links">
        <RouterLink v-for="d in days" :key="d.to" :to="d.to" class="day-link">
          <span class="day-label">{{ d.label }}</span>
          <span class="day-hint">{{ d.hint }}</span>
        </RouterLink>
      </div>
    </div>
  </nav>

  <main class="app-main">
    <div class="page-card">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
  </main>
</template>

<style scoped>
/* ─── Nav bar ─── */
.day-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(100deg, #1b2a4a 0%, #223458 55%, #1e3a4f 100%);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06) inset, 0 6px 20px rgba(15, 23, 42, 0.18);
  font-family: var(--vt-font);
}

.nav-inner {
  max-width: 1080px;
  margin: 0 auto;
  height: 62px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: linear-gradient(135deg, #42b883, #2f9e6d);
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 3px 10px rgba(66, 184, 131, 0.4);
}
.brand-text {
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.01em;
}

/* Day links */
.day-links {
  display: flex;
  gap: 4px;
}
.day-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
  gap: 2px;
  padding: 8px 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.18s ease, transform 0.12s ease;
}
.day-label {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.18s ease;
}
.day-hint {
  color: #7c93b8;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: color 0.18s ease;
}
.day-link:hover {
  background: rgba(255, 255, 255, 0.07);
}
.day-link:hover .day-label { color: #fff; }

/* vue-router active class */
.day-link.router-link-active {
  background: linear-gradient(135deg, #42b883, #2f9e6d);
  box-shadow: 0 4px 14px rgba(66, 184, 131, 0.35);
}
.day-link.router-link-active .day-label { color: #fff; }
.day-link.router-link-active .day-hint { color: rgba(255, 255, 255, 0.85); }

/* ─── Page area ─── */
.app-main {
  min-height: calc(100vh - 62px);
  padding: 40px 20px 64px;
  background:
    radial-gradient(1200px 400px at 50% -120px, rgba(66, 184, 131, 0.08), transparent 70%),
    var(--vt-bg);
}

/* ─── Card container that every day view sits inside ─── */
.page-card {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: clamp(22px, 4vw, 36px);
  background: var(--vt-card);
  border: 1px solid var(--vt-border);
  border-radius: 20px;
  box-shadow: var(--vt-shadow-card);
}

/* ─── Route transition (applies to every day view) ─── */
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }
.page-enter-active,
.page-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }

@media (max-width: 560px) {
  .brand-text { display: none; }
  .day-hint { display: none; }
  .nav-inner { padding: 0 14px; }
  .day-link { padding: 8px 12px; }
}
</style>
