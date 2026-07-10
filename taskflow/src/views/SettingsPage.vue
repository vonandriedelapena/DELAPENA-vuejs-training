<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-grad">
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Settings</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Summary stat cards (mirrors the Tasks tab) -->
      <div class="summary">
        <div class="stat-card">
          <span class="stat-num stat-total">{{ totalCount }}</span>
          <span class="stat-lbl">Total</span>
        </div>
        <div class="stat-card">
          <span class="stat-num stat-done">{{ doneCount }}</span>
          <span class="stat-lbl">Done</span>
        </div>
        <div class="stat-card">
          <span class="stat-num stat-pending">{{ pendingCount }}</span>
          <span class="stat-lbl">Pending</span>
        </div>
      </div>

      <!-- Actions -->
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>Data</ion-label>
        </ion-list-header>
        <ion-item button :disabled="doneCount === 0" :detail="false" @click="clearAllDone">
          <ion-icon slot="start" :icon="trashOutline" color="danger" />
          <ion-label color="danger">Clear completed tasks</ion-label>
          <ion-note slot="end">{{ doneCount }}</ion-note>
        </ion-item>
      </ion-list>

      <!-- About -->
      <ion-list :inset="true">
        <ion-list-header>
          <ion-label>About</ion-label>
        </ion-list-header>
        <ion-item :detail="false">
          <ion-icon slot="start" :icon="informationCircleOutline" color="primary" />
          <ion-label>TaskFlow</ion-label>
          <ion-note slot="end">Ionic + Vue</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
} from '@ionic/vue';
import { trashOutline, informationCircleOutline } from 'ionicons/icons';
import { useTaskStore } from '@/stores/taskStore';

const store = useTaskStore();
const { totalCount, doneCount, pendingCount } = storeToRefs(store);
const { clearAllDone } = store;
</script>

<style scoped>
.header-grad {
  --background: var(--ion-color-primary);
  --color: #fff;
}
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
/* Whole card gets a solid color (numbers stay white) */
.summary .stat-card:nth-child(1) { background: var(--c-total); }
.summary .stat-card:nth-child(2) { background: var(--c-done); }
.summary .stat-card:nth-child(3) { background: var(--c-pending); }
</style>
