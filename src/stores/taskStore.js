import { defineStore } from 'pinia'

// Shared task state used by the router guard, HomeView and TaskDetailView.
export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [
      { id: 1, name: 'Finish Vue props lesson', done: false, dueDate: '2026-07-01', priority: 'High' },
      { id: 2, name: 'Review emits & slots',    done: true,  dueDate: '2026-06-30', priority: 'Medium' },
      { id: 3, name: 'Build TaskCard component', done: false, dueDate: '2026-07-02', priority: 'Low' },
    ],
  }),

  getters: {
    // Look up a single task by id (id may arrive as a string from route params).
    getTaskById: (state) => (id) => state.tasks.find(t => t.id === Number(id)),
    doneCount:    (state) => state.tasks.filter(t => t.done).length,
    totalCount:   (state) => state.tasks.length,
  },

  actions: {
    toggleDone(id) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.done = !task.done
    },
    removeTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
    },
  },
})
