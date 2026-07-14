<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-grad">
        <ion-title>Tasks</ion-title>
      </ion-toolbar>
      <!-- Filter bar: the Day 1 All/Done/Pending buttons become an ion-segment -->
      <ion-toolbar class="filter-toolbar">
        <ion-segment v-model="filter" mode="ios">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="pending">
            <ion-label>Pending</ion-label>
          </ion-segment-button>
          <ion-segment-button value="done">
            <ion-label>Done</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tasks</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Live stats — three summary cards (Day 1: Total | Done | Pending) -->
      <div class="summary">
        <div class="stat-card stat-total">
          <span class="stat-num">{{ totalCount }}</span>
          <span class="stat-lbl">Total</span>
        </div>
        <div class="stat-card stat-done">
          <span class="stat-num">{{ doneCount }}</span>
          <span class="stat-lbl">Done</span>
        </div>
        <div class="stat-card stat-pending">
          <span class="stat-num">{{ pendingCount }}</span>
          <span class="stat-lbl">Pending</span>
        </div>
      </div>

      <!-- Empty states -->
      <div v-if="totalCount === 0" class="empty">
        <ion-icon :icon="clipboardOutline" class="empty-icon" />
        <h2>No tasks yet</h2>
        <p>Tap the <strong>+</strong> button to add your first task.</p>
      </div>
      <div v-else-if="visibleTasks.length === 0" class="empty">
        <ion-icon :icon="funnelOutline" class="empty-icon" />
        <h2>Nothing here</h2>
        <p>No {{ filter }} tasks right now.</p>
      </div>

      <!-- Task list (rounded, card-like inset list) -->
      <ion-list v-else :inset="true" class="task-list">
        <ion-item-sliding v-for="task in visibleTasks" :key="task.id">
          <ion-item
            :class="[`priority-${task.priority.toLowerCase()}`, { 'is-done': task.done }]"
            lines="full"
          >
            <ion-checkbox
              slot="start"
              :checked="task.done"
              @ionChange="toggleTask(task.id)"
            />

            <ion-thumbnail v-if="task.photo" slot="start" class="thumb">
              <ion-img :src="task.photo" />
            </ion-thumbnail>

            <ion-label class="task-name" :class="{ done: task.done }" @click="openTask(task.id)">
              {{ task.name }}
              <ion-icon :icon="chevronForward" class="chev" />
            </ion-label>

            <ion-select
              slot="end"
              :value="task.priority"
              interface="popover"
              aria-label="Priority"
              :class="`priority-text-${task.priority.toLowerCase()}`"
              @ionChange="setPriority(task.id, $event.detail.value)"
            >
              <ion-select-option value="Low">Low</ion-select-option>
              <ion-select-option value="Medium">Medium</ion-select-option>
              <ion-select-option value="High">High</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Swipe left to reveal Remove -->
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="removeTask(task.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- Floating action button to add a new task -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button aria-label="Add task" @click="presentAddAlert">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonImg,
  alertController,
} from '@ionic/vue';
import { add, trashOutline, clipboardOutline, funnelOutline, chevronForward } from 'ionicons/icons';
import { useTaskStore } from '@/stores/taskStore';

const router = useRouter();
const store = useTaskStore();
// Reactive state from the store
const { tasks, totalCount, doneCount, pendingCount } = storeToRefs(store);
// Actions can be destructured directly
const { addTask, toggleTask, setPriority, removeTask } = store;

// Local UI state — the active filter (not shared task data)
const filter = ref<'all' | 'pending' | 'done'>('all');

const visibleTasks = computed(() => {
  if (filter.value === 'done') return tasks.value.filter((t) => t.done);
  if (filter.value === 'pending') return tasks.value.filter((t) => !t.done);
  return tasks.value;
});

// Navigate to the Task Detail page (Day 7 — useRouter().push())
function openTask(id: number) {
  router.push(`/tabs/tasks/${id}`);
}

// FAB → alert with a single text input (alerts can't mix text + radio inputs)
async function presentAddAlert() {
  const alert = await alertController.create({
    header: 'New Task',
    inputs: [
      {
        name: 'name',
        type: 'text',
        placeholder: 'What needs to be done?',
      },
    ],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Add',
        handler: (data) => {
          addTask(data.name, 'Medium');
        },
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
/* ─── Header (solid brand color) ─── */
.header-grad {
  --background: var(--ion-color-primary);
  --color: #fff;
}

/* ─── Filter segment: give it breathing room ─── */
.filter-toolbar {
  --background: transparent;
  padding: 4px 12px 8px;
}

/* ─── Summary stat cards (solid colors) ─── */
.summary {
  display: flex;
  gap: var(--app-gap);
  padding: 16px;
}
.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 18px 8px;
  border-radius: var(--app-radius);
  color: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
.stat-num {
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  color: #fff;
}
.stat-lbl {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.85);
}
.stat-total { background: var(--c-total); }
.stat-done { background: var(--c-done); }
.stat-pending { background: var(--c-pending); }

/* ─── FAB (solid brand color) ─── */
ion-fab-button {
  --background: var(--ion-color-primary);
  --background-activated: var(--ion-color-primary-shade);
  --background-hover: var(--ion-color-primary-tint);
  --color: #fff;
  --box-shadow: 0 8px 20px rgba(91, 91, 214, 0.4);
}

/* ─── Task list ─── */
.task-list {
  border-radius: var(--app-radius);
  overflow: hidden;
}
.task-list ion-item {
  --padding-start: 12px;
  /* Keep every row the same height whether or not it has a photo */
  --min-height: 64px;
}
.task-list ion-checkbox {
  --checkbox-background-checked: var(--ion-color-primary);
  --border-color-checked: var(--ion-color-primary);
  margin-inline-end: 12px;
}
/* Day 8: task photo thumbnail */
.thumb {
  --size: 46px;
  --border-radius: 12px;
  margin: 8px 12px 8px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}
/* Crop the photo to fill the square instead of stretching it */
.thumb ion-img::part(image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* Task name is tappable → opens detail */
.task-name {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.chev {
  font-size: 14px;
  color: var(--ion-color-medium);
}
/* Priority accent edge + faint tint per row */
.task-list ion-item.priority-high {
  --background: rgba(235, 68, 90, 0.06);
}
.task-list ion-item.priority-high::part(native) {
  border-left: 5px solid var(--c-high);
}
.task-list ion-item.priority-medium {
  --background: rgba(240, 144, 14, 0.07);
}
.task-list ion-item.priority-medium::part(native) {
  border-left: 5px solid var(--c-med);
}
.task-list ion-item.priority-low {
  --background: rgba(59, 130, 246, 0.06);
}
.task-list ion-item.priority-low::part(native) {
  border-left: 5px solid var(--c-low);
}

/* Strike-through completed task names (Day 1 behavior) */
.done {
  text-decoration: line-through;
  opacity: 0.55;
}

/* Color-code the priority select value + arrow via its shadow parts */
.priority-text-high::part(text),
.priority-text-high::part(icon) { color: var(--c-high); }
.priority-text-medium::part(text),
.priority-text-medium::part(icon) { color: var(--c-med); }
.priority-text-low::part(text),
.priority-text-low::part(icon) { color: var(--c-low); }
.priority-text-high::part(text),
.priority-text-medium::part(text),
.priority-text-low::part(text) { font-weight: 600; }

/* ─── Empty state ─── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 24px;
  color: var(--ion-color-medium);
}
.empty-icon {
  font-size: 64px;
  margin-bottom: 12px;
  opacity: 0.5;
}
.empty h2 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-text-color);
}
.empty p {
  margin: 0;
  font-size: 14px;
}
</style>
