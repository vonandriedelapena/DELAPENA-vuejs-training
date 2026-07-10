// =============================================================
//  DAY 6 — Pinia Store ported from the Day 1 Task Counter
//  The Day 1 app kept everything in local ref()s. Here the same
//  reactive logic lives in a centralized Pinia store so the
//  Tasks / Completed / Settings tabs all share one source of truth.
// =============================================================
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type Priority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: number
  name: string
  done: boolean
  priority: Priority
}

export const useTaskStore = defineStore('tasks', () => {
  // --- state ---
  const tasks = ref<Task[]>([
    { id: 1, name: 'Finish Vue props lesson', done: false, priority: 'High' },
    { id: 2, name: 'Review emits & slots', done: true, priority: 'Medium' },
    { id: 3, name: 'Build TaskCard component', done: false, priority: 'Low' },
  ])
  const nextId = ref(4)

  // --- getters (computed) ---
  const totalCount = computed(() => tasks.value.length)
  const doneCount = computed(() => tasks.value.filter((t) => t.done).length)
  const pendingCount = computed(() => totalCount.value - doneCount.value)

  // --- actions ---
  // Guard against empty/whitespace names; priority defaults to Medium.
  function addTask(name: string, priority: Priority = 'Medium') {
    const trimmed = (name ?? '').trim()
    if (!trimmed) return
    tasks.value.push({ id: nextId.value++, name: trimmed, done: false, priority })
  }

  function toggleTask(id: number) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.done = !task.done
  }

  function setPriority(id: number, priority: Priority) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.priority = priority
  }

  function removeTask(id: number) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function clearAllDone() {
    tasks.value = tasks.value.filter((t) => !t.done)
  }

  return {
    tasks,
    nextId,
    totalCount,
    doneCount,
    pendingCount,
    addTask,
    toggleTask,
    setPriority,
    removeTask,
    clearAllDone,
  }
})
