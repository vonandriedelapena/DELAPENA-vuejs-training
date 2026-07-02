// =============================================================
//  DAY 4 ASSIGNMENT — Pinia Store: stores/taskStore.js
//  Topic: Centralized State with Pinia (state, getters, actions)
//  Files: stores/taskStore.js  |  TaskListView.vue (updated)
//  Time: 60 minutes
// =============================================================
//
// OBJECTIVE
// ---------
// Migrate all task-related state OUT of your components and INTO a
// centralized Pinia store. Components become thin — they only call
// store actions and read store state. They never manage task data locally.
//
// WHAT TO BUILD
// -------------
// stores/taskStore.js:
//   - state: tasks array, nextId counter
//   - getters (computed): doneCount, pendingCount, totalCount
//   - actions: addTask(name), toggleTask(id), removeTask(id)
//
// NOTE: Day 3 already registers a store with the id 'tasks'. To keep both
// days working side by side in the same app, this Day 4 store uses the
// distinct id 'day4Tasks'. In a real single-app project you'd have ONE
// task store shared everywhere.
// =============================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// TODO 1: Export a useTaskStore function using defineStore  ✅
export const useTaskStore = defineStore('day4Tasks', () => {

  // TODO 2: Define state using ref()  ✅
  const tasks = ref([
    { id: 1, name: 'Learn Pinia state', done: false },
    { id: 2, name: 'Refactor component to use the store', done: true },
    { id: 3, name: 'Destructure state with storeToRefs()', done: false },
  ])
  const nextId = ref(4)

  // TODO 3: Define getters using computed()  ✅
  const totalCount   = computed(() => tasks.value.length)
  const doneCount    = computed(() => tasks.value.filter(t => t.done).length)
  const pendingCount = computed(() => totalCount.value - doneCount.value)

  // TODO 4: Define addTask(name) action  ✅
  // - Guard against empty names
  // - Push a new task: { id: nextId.value++, name, done: false }
  function addTask(name) {
    const trimmed = (name ?? '').trim()
    if (!trimmed) return
    tasks.value.push({ id: nextId.value++, name: trimmed, done: false })
  }

  // TODO 5: Define toggleTask(id) action  ✅
  function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.done = !task.done
  }

  // TODO 6: Define removeTask(id) action  ✅
  function removeTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  // TODO 7: Return everything the component needs to access  ✅
  return { tasks, nextId, totalCount, doneCount, pendingCount, addTask, toggleTask, removeTask }
})
