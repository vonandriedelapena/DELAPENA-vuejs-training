// =============================================================
//  DAY 3 ASSIGNMENT — Vue Router: router/index.js
//  Topic: Dynamic Routes, Navigation Guards, Programmatic Navigation
//  Files: router/index.js  |  HomeView.vue  |  TaskDetailView.vue
//  Time: 60 minutes
// =============================================================
//
// OBJECTIVE
// ---------
// Add client-side routing to your task app. Students will create a
// multi-page SPA with dynamic routes, query params, and a guard that
// protects the detail page from invalid task IDs.
//
// WHAT TO BUILD
// -------------
//  1. /home         → HomeView.vue  (task list with router-link to each task)
//  2. /task/:id     → TaskDetailView.vue  (detail page for one task)
//  3. /about        → AboutView.vue  (static info page)
//  4. /             → redirects to /home
//
// NAVIGATION GUARD
// ----------------
//  If the user navigates to /task/:id with a non-existent ID:
//  → redirect to /home?error=notfound
//  HomeView should display a warning banner when it sees ?error=notfound
//
// REQUIREMENTS (Acceptance Criteria)
// ------------------------------------
//  [x] Install vue-router@4: npm install vue-router@4
//  [x] createRouter with createWebHistory
//  [x] Dynamic route: /task/:id (params.id is a string — cast to Number)
//  [x] router.beforeEach checks if the task exists
//  [x] router-link used on HomeView for navigation (not <a> tags)
//  [x] useRoute() used in TaskDetailView to read params.id
//  [x] useRouter() used for the "Back" button (programmatic navigation)
//  [x] App.vue contains <RouterView />
//
// EXTENSION (addtional points)
// ---------
//  - Add a /stats route that shows total/done/pending counts
//  - Add router-link-active styling to the nav links
//  - Add a page transition animation using Vue's <Transition> component
//
// HINTS (read only if stuck)
// ---------------------------
//  Hint 1: import { createRouter, createWebHistory } from 'vue-router'
//  Hint 2: { path: '/task/:id', component: TaskDetailView, meta: { requiresTask: true } }
//  Hint 3: router.beforeEach((to, from, next) => { ... next() ... })
//  Hint 4: In TaskDetailView — const route = useRoute(); route.params.id
//  Hint 5: Cast param to number — Number(route.params.id) or parseInt(route.params.id)
//  Hint 6: For the error banner — useRoute().query.error === 'notfound'
//  Hint 7: Always call next() at the end of beforeEach or navigation hangs!
// =============================================================

import { createRouter, createWebHistory } from 'vue-router'

// TODO 1: Import your view components
import HomeView       from '@/views/Day3/HomeView.vue'
import TaskDetailView from '@/views/Day3/TaskDetailView.vue'
import AboutView      from '@/views/Day3/AboutView.vue'

// Day 1, 2 & 4 entry views (for the top-level day navigation)
import Day1Counter     from '@/views/Day1/day1_taskCounter.vue'
import Day2TaskList     from '@/views/Day2/TaskListView_day2.vue'
import Day4TaskList     from '@/views/Day4/TaskListView.vue'

// TODO 2: Import your Pinia task store so the guard can check if a task exists
import { useTaskStore } from '@/stores/taskStore'

const routes = [
  // TODO 3: Add a redirect from '/' to '/home'
  { path: '/', redirect: '/home' },

  // Day 1, 2 & 4 assignment views
  { path: '/day1', component: Day1Counter },
  { path: '/day2', component: Day2TaskList },
  { path: '/day4', component: Day4TaskList },

  // TODO 4: Add the /home route (Day 3 home)
  { path: '/home', component: HomeView },

  // TODO 5: Add the /task/:id dynamic route
  // Add meta: { requiresTask: true } so the guard knows to protect it
  { path: '/task/:id', component: TaskDetailView, meta: { requiresTask: true } },

  // TODO 6: Add the /about route
  { path: '/about', component: AboutView },

  // Catch-all: any unmatched URL (e.g. /9999) bounces home with the error flag,
  // same as a non-existent task id.
  { path: '/:pathMatch(.*)*', redirect: { path: '/home', query: { error: 'notfound' } } },
]

const router = createRouter({
  // TODO 7: Use createWebHistory() for clean URLs
  history: createWebHistory(),
  routes,
})

// TODO 8: Add a beforeEach navigation guard
// - Check if to.meta.requiresTask is true
// - If so, get the task store and check if a task with to.params.id exists
// - If NOT found: next({ path: '/home', query: { error: 'notfound' } })
// - If found (or not a protected route): next()
router.beforeEach((to, from, next) => {
  // Only guard routes that explicitly require a task to exist.
  if (to.meta.requiresTask) {
    const taskStore = useTaskStore()

    // route params are always strings — cast to Number before comparing.
    const id = Number(to.params.id)
    const taskExists = taskStore.tasks.some(t => t.id === id)

    if (!taskExists) {
      // Bad / non-existent id → bounce home with an error flag for the banner.
      return next({ path: '/home', query: { error: 'notfound' } })
    }
  }

  next() // don't remove this — it must always be called
})

export default router
