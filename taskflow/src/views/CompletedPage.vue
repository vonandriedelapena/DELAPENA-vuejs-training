<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-grad">
        <ion-title>Completed</ion-title>
        <ion-buttons slot="end">
          <ion-button color="light" :disabled="completedTasks.length === 0" @click="confirmClear">
            Clear All
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Completed</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Progress toward finishing everything -->
      <div v-if="totalCount > 0" class="progress-card">
        <div class="progress-head">
          <span>{{ doneCount }} of {{ totalCount }} done</span>
          <span class="pct">{{ percent }}%</span>
        </div>
        <ion-progress-bar :value="totalCount ? doneCount / totalCount : 0" color="success" />
      </div>

      <!-- Empty state -->
      <div v-if="completedTasks.length === 0" class="empty">
        <ion-icon :icon="checkmarkDoneCircleOutline" class="empty-icon" />
        <h2>Nothing completed yet</h2>
        <p>Check off tasks on the Tasks tab and they'll show up here.</p>
      </div>

      <!-- Day 7 step 6: show only tasks where done === true from the Pinia store -->
      <ion-list v-else :inset="true">
        <ion-item
          v-for="task in completedTasks"
          :key="task.id"
          button
          :detail="true"
          @click="openTask(task.id)"
        >
          <ion-icon slot="start" :icon="checkmarkCircle" color="success" />
          <ion-label class="done">{{ task.name }}</ion-label>
          <ion-badge slot="end" :class="`pbadge-${task.priority.toLowerCase()}`">
            {{ task.priority }}
          </ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
  IonLabel,
  IonBadge,
  IonIcon,
  IonButton,
  IonButtons,
  IonProgressBar,
  alertController,
} from '@ionic/vue';
import { checkmarkCircle, checkmarkDoneCircleOutline } from 'ionicons/icons';
import { useTaskStore } from '@/stores/taskStore';

const router = useRouter();
const store = useTaskStore();
const { tasks, totalCount, doneCount } = storeToRefs(store);
const { clearAllDone } = store;

const completedTasks = computed(() => tasks.value.filter((t) => t.done));
const percent = computed(() =>
  totalCount.value ? Math.round((doneCount.value / totalCount.value) * 100) : 0
);

function openTask(id: number) {
  router.push(`/tabs/tasks/${id}`);
}

async function confirmClear() {
  const alert = await alertController.create({
    header: 'Clear completed?',
    message: `This will remove ${completedTasks.value.length} completed task(s).`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Clear', role: 'destructive', handler: () => clearAllDone() },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
.header-grad {
  --background: var(--ion-color-primary);
  --color: #fff;
}
.progress-card {
  margin: 16px;
  padding: 18px;
  border-radius: var(--app-radius);
  background: var(--c-done);
  color: #fff;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
}

/* Priority badges */
.pbadge-high { --background: var(--c-high); --color: #fff; }
.pbadge-medium { --background: var(--c-med); --color: #fff; }
.pbadge-low { --background: var(--c-low); --color: #fff; }
.progress-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}
.pct {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
}
.progress-card ion-progress-bar {
  --background: rgba(255, 255, 255, 0.35);
  --progress-background: #fff;
  border-radius: 999px;
  height: 8px;
}

.done {
  text-decoration: line-through;
  opacity: 0.55;
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
  margin: 0;
  font-size: 14px;
  max-width: 260px;
}
</style>
