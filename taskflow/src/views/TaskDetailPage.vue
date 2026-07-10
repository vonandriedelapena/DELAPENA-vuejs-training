<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-grad">
        <!-- Day 7 step 5: IonBackButton inside IonButtons inside IonToolbar -->
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tasks" color="light" />
        </ion-buttons>
        <ion-title>Task Detail</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Task found: show all fields from the Pinia store -->
      <div v-if="task" class="detail">
        <div class="hero" :class="`accent-${task.priority.toLowerCase()}`">
          <ion-icon :icon="task.done ? checkmarkCircle : ellipseOutline" class="hero-icon" />
          <h1 :class="{ done: task.done }">{{ task.name }}</h1>
          <ion-badge :class="`pbadge-${task.priority.toLowerCase()}`">
            {{ task.priority }} priority
          </ion-badge>
        </div>

        <ion-list :inset="true">
          <ion-item :detail="false">
            <ion-icon slot="start" :icon="keyOutline" color="medium" />
            <ion-label>Task ID</ion-label>
            <ion-note slot="end">#{{ task.id }}</ion-note>
          </ion-item>
          <ion-item :detail="false">
            <ion-icon slot="start" :icon="documentTextOutline" color="medium" />
            <ion-label>Name</ion-label>
            <ion-note slot="end">{{ task.name }}</ion-note>
          </ion-item>
          <ion-item :detail="false">
            <ion-icon slot="start" :icon="flagOutline" color="medium" />
            <ion-label>Priority</ion-label>
            <ion-note slot="end" :class="`ptext-${task.priority.toLowerCase()}`">
              {{ task.priority }}
            </ion-note>
          </ion-item>
          <ion-item :detail="false">
            <ion-icon
              slot="start"
              :icon="task.done ? checkmarkCircle : timeOutline"
              :color="task.done ? 'success' : 'warning'"
            />
            <ion-label>Status</ion-label>
            <ion-note slot="end">{{ task.done ? 'Done' : 'Pending' }}</ion-note>
          </ion-item>
        </ion-list>

        <!-- Handy actions from the detail view -->
        <div class="actions">
          <ion-button expand="block" @click="toggleTask(task.id)">
            <ion-icon slot="start" :icon="task.done ? arrowUndoOutline : checkmarkOutline" />
            {{ task.done ? 'Mark as pending' : 'Mark as done' }}
          </ion-button>
          <ion-button expand="block" color="danger" fill="outline" @click="handleRemove">
            <ion-icon slot="start" :icon="trashOutline" />
            Delete task
          </ion-button>
        </div>
      </div>

      <!-- Task not found (e.g. deleted or bad id) -->
      <div v-else class="empty">
        <ion-icon :icon="alertCircleOutline" class="empty-icon" />
        <h2>Task not found</h2>
        <p>This task may have been removed.</p>
        <ion-button fill="clear" @click="router.replace('/tabs/tasks')">Back to Tasks</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonBadge,
  IonIcon,
  IonButton,
} from '@ionic/vue';
import {
  checkmarkCircle,
  ellipseOutline,
  keyOutline,
  documentTextOutline,
  flagOutline,
  timeOutline,
  checkmarkOutline,
  arrowUndoOutline,
  trashOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useTaskStore } from '@/stores/taskStore';

const route = useRoute();
const router = useRouter();
const store = useTaskStore();
const { toggleTask, removeTask } = store;

// Day 7 step 4: read the :id route param and find the task from Pinia.
// computed() keeps it reactive so store changes (toggle) update the view.
const task = computed(() => store.getTaskById(route.params.id as string));

function handleRemove() {
  if (!task.value) return;
  removeTask(task.value.id);
  router.replace('/tabs/tasks');
}
</script>

<style scoped>
.header-grad {
  --background: var(--ion-color-primary);
  --color: #fff;
}

/* Hero header for the task */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  margin: 16px;
  padding: 28px 20px;
  border-radius: var(--app-radius);
  color: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
.accent-high { background: var(--c-high); }
.accent-medium { background: var(--c-med); }
.accent-low { background: var(--c-low); }
.hero-icon { font-size: 44px; }
.hero h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}
.hero h1.done { text-decoration: line-through; opacity: 0.75; }
.hero ion-badge {
  --background: rgba(255, 255, 255, 0.25);
  --color: #fff;
}

/* Priority-colored note text */
.ptext-high { color: var(--c-high); font-weight: 600; }
.ptext-medium { color: var(--c-med); font-weight: 600; }
.ptext-low { color: var(--c-low); font-weight: 600; }

.actions {
  padding: 8px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

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
  margin: 0 0 8px;
  font-size: 14px;
}
</style>
