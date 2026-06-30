<!--
=============================================================
  DAY 2 ASSIGNMENT — Reusable TaskCard Component
  Topic: Props, Emits, Slots, Component Lifecycle
  Files: TaskCard.vue (child)  +  TaskListView.vue (parent)
  Time: 60 minutes
=============================================================

OBJECTIVE
---------
Build a reusable TaskCard child component that accepts data as props
and communicates back to the parent via custom events (emits). The
parent renders a list of TaskCards and handles all state changes.

WHAT TO BUILD — TaskCard.vue (this file)
-----------------------------------------
  1. Accept a "task" prop: { id, name, done, dueDate }
  2. Display the task name and dueDate (via a named slot "meta")
  3. Emit "complete" event (payload: task.id) when Complete/Undo clicked
  4. Emit "delete" event (payload: task.id) when Delete clicked
  5. Show "Complete" when task.done is false, "Undo" when true
  6. Apply a visual style change when task.done is true

WHAT TO BUILD — TaskListView.vue (see that file)
-------------------------------------------------
  1. Hold a tasks ref array with at least 3 sample tasks
  2. Render a TaskCard for each task using v-for
  3. Handle @complete → toggle that task's done property
  4. Handle @delete → remove that task from the array
  5. Fill the "meta" named slot with the due date

REQUIREMENTS (Acceptance Criteria)
------------------------------------
  [x] TaskCard uses defineProps({ task: Object })
  [x] TaskCard uses defineEmits(['complete', 'delete'])
  [x] TaskCard has <slot name="meta" /> for optional metadata
  [x] Parent passes :task="task" and listens @complete @delete
  [x] Parent fills the slot with <template #meta>...</template>
  [x] Data flows DOWN (props) and events flow UP (emits)
  [x] Parent owns the state — TaskCard never mutates props directly

EXTENSION (additional points)
---------------------------------
  - Add a priority badge prop (low/medium/high) with colour coding
  - Add an edit mode: clicking the task name turns it into an input
  - Emit an "update" event when the edited name is saved

HINTS (read only if stuck)
---------------------------
  Hint 1: const props = defineProps({ task: { type: Object, required: true } })
  Hint 2: const emit = defineEmits(['complete', 'delete'])
  Hint 3: @click="emit('complete', props.task.id)"
  Hint 4: In the parent — @complete="handleComplete"
           function handleComplete(id) { find task by id, toggle done }
  Hint 5: Named slot in child  → <slot name="meta" />
           Fill in parent      → <template #meta>Due: {{ task.dueDate }}</template>
  Hint 6: NEVER do this inside TaskCard: props.task.done = !props.task.done
           That mutates a prop directly — Vue will warn you. Emit instead.
=============================================================
-->

<!-- ─── TaskCard.vue ─── -->
<script setup>
import { ref } from 'vue'

// TODO 2: Define the task prop with type Object, required: true
const props = defineProps({
  task: { type: Object, required: true },
})

// TODO 3: Define emits for 'complete' and 'delete'
// Extension: 'update' fires when an edited name is saved
const emit = defineEmits(['complete', 'delete', 'update'])

// Extension: edit mode — clicking the name turns it into an input
const editing = ref(false)
const draftName = ref('')

function startEdit() {
  draftName.value = props.task.name
  editing.value = true
}

function saveEdit() {
  const name = draftName.value.trim()
  if (name && name !== props.task.name) {
    emit('update', { id: props.task.id, name })
  }
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}

// Local directive: auto-focus the input when edit mode opens
const vFocus = { mounted: (el) => el.focus() }
</script>

<template>
  <!-- TODO 4: wrapper with completed class bound to task.done -->
  <div
    class="task-card"
    :class="[{ completed: task.done }, task.priority ? 'p-' + task.priority.toLowerCase() : '']"
  >

    <div class="task-header">
      <!-- Status indicator: empty circle / green check when done -->
      <button
        class="status-dot"
        :class="{ on: task.done }"
        @click="emit('complete', task.id)"
        :title="task.done ? 'Mark as not done' : 'Mark as complete'"
      >
        <svg v-if="task.done" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- TODO 5: Display the task name (Extension: click to edit) -->
      <input
        v-if="editing"
        v-model="draftName"
        class="edit-input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
        v-focus
      />
      <span v-else class="name" @click="startEdit" title="Click to edit">
        {{ task.name }}
      </span>

      <span
        v-if="task.priority"
        class="badge"
        :class="task.priority.toLowerCase()"
      >
        {{ task.priority }}
      </span>
    </div>

    <!-- TODO 6: named slot for metadata -->
    <div class="task-meta">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M3 10h18M8 2v4M16 2v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <slot name="meta" />
    </div>

    <div class="task-actions">
      <!-- TODO 7: Complete/Undo button — text + emit based on task.done -->
      <button class="btn-complete" @click="emit('complete', task.id)">
        {{ task.done ? '↩ Undo' : '✓ Complete' }}
      </button>

      <!-- TODO 8: Delete button — emits 'delete' with task.id -->
      <button class="btn-delete" @click="emit('delete', task.id)">
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  position: relative;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px 18px 24px;
  margin-bottom: 14px;
  box-shadow: 0 1px 3px rgba(27, 42, 74, 0.06);
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s, background 0.2s;
}
/* Priority accent stripe down the left edge */
.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #cbd5e1;
  transition: background 0.2s;
}
.task-card.p-low::before    { background: #38bdf8; }
.task-card.p-medium::before { background: #facc15; }
.task-card.p-high::before   { background: #f87171; }
.task-card:hover {
  box-shadow: 0 8px 24px rgba(27, 42, 74, 0.12);
  transform: translateY(-2px);
}
.task-card.completed {
  background: #f0fdf4;
  border-color: #86efac;
}
.task-card.completed::before { background: #42B883; }

/* ─── Header: status dot + name + priority badge ─── */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

/* ─── Status dot (click to complete) ─── */
.status-dot {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  background: #ffffff;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
}
.status-dot:hover { border-color: #42B883; }
.status-dot:active { transform: scale(0.9); }
.status-dot.on {
  background: #42B883;
  border-color: #42B883;
}
.task-header span.name {
  flex: 1;
  min-width: 0;
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4;
  color: #1B2A4A;
  cursor: pointer;
  word-break: break-word;
}
.task-header span.name:hover {
  color: #42B883;
}
.task-card.completed span.name {
  text-decoration: line-through;
  color: #9ca3af;
}
.edit-input {
  flex: 1;
  min-width: 0;
  padding: 6px 10px;
  border: 1px solid #42B883;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1B2A4A;
  outline: none;
}
.edit-input:focus {
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

/* ─── Meta (due date slot) ─── */
.task-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 34px;
  text-align: left;
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 14px;
}
.task-meta svg { flex-shrink: 0; color: #cbd5e1; }

/* ─── Priority badge ─── */
.badge {
  flex-shrink: 0;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.badge.low    { background: #e0f2fe; color: #0369a1; }
.badge.medium { background: #fef9c3; color: #a16207; }
.badge.high   { background: #fee2e2; color: #dc2626; }

/* ─── Actions ─── */
.task-actions {
  display: flex;
  gap: 12px;
}
.btn-complete,
.btn-delete {
  flex: 1;
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.15s, transform 0.1s;
}
.btn-complete:active,
.btn-delete:active {
  transform: scale(0.96);
}
.btn-complete {
  background: #42B883;
  color: #ffffff;
}
.btn-complete:hover {
  background: #369b6e;
}
.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}
.btn-delete:hover {
  background: #fecaca;
}
</style>
