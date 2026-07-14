import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'

export type Priority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: number
  name: string
  done: boolean
  priority: Priority
  photo?: string
}

// Day 9: key under which the tasks array is stored in Capacitor Preferences.
const STORAGE_KEY = 'taskflow.tasks'

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

  // Look up a single task by id (route params arrive as strings).
  function getTaskById(id: number | string) {
    return tasks.value.find((t) => t.id === Number(id))
  }

  // ─── Day 9: persistence ───────────────────────────────────────────────
  // Preferences only stores strings, so we serialize the tasks array to JSON.
  async function saveTasks() {
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(tasks.value) })
  }

  // Load saved tasks on startup. If nothing is stored, or the data is corrupt,
  // fail gracefully and keep the current (seed) tasks.
  async function loadTasks() {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY })
      if (!value) return // nothing saved yet → keep seed tasks
      const parsed = JSON.parse(value) as Task[]
      if (Array.isArray(parsed)) {
        tasks.value = parsed
        // Keep nextId ahead of the highest saved id so new ids don't collide.
        nextId.value = parsed.reduce((max, t) => Math.max(max, t.id), 0) + 1
      }
    } catch (err) {
      console.warn('[taskStore] Could not load tasks, using defaults:', err)
    }
  }

  // --- actions (each persists after mutating) ---
  function addTask(name: string, priority: Priority = 'Medium') {
    const trimmed = (name ?? '').trim()
    if (!trimmed) return
    tasks.value.push({ id: nextId.value++, name: trimmed, done: false, priority })
    saveTasks()
  }

  function toggleTask(id: number) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.done = !task.done
    saveTasks()
  }

  function setPriority(id: number, priority: Priority) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.priority = priority
    saveTasks()
  }

  function addPhotoToTask(id: number, path: string) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.photo = path
    saveTasks()
  }

  function removeTask(id: number) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
    saveTasks()
  }

  function clearAllDone() {
    tasks.value = tasks.value.filter((t) => !t.done)
    saveTasks()
  }

  return {
    tasks,
    nextId,
    totalCount,
    doneCount,
    pendingCount,
    getTaskById,
    saveTasks,
    loadTasks,
    addTask,
    toggleTask,
    setPriority,
    addPhotoToTask,
    removeTask,
    clearAllDone,
  }
})
