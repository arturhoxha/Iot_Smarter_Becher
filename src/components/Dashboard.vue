<script>
import axios from 'axios';
export default {
  data() {
    return {
      lastDrink: 0,         // Die zuletzt getrunkene Menge (Differenz)
      totalAmount: 0,       // Gesamtmenge heute
      timestamp: null,      // Zeitstempel der letzten Messung
      dailyGoal: 2000,
      showReminder: false,
    };
  },
  computed: {
    progressPercentage() {
      return ((this.totalAmount / this.dailyGoal) * 100).toFixed(1);
    },
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    async fetchLiveStatus() {
      try {
        const response = await axios.get('https://thankful-ocean-0345cfc1e.4.azurestaticapps.net/api/liveStatus');
        const data = response.data.latestData;
        this.lastDrink = data.differenz || 0;
        this.totalAmount = data.getrunken || 0;
        this.timestamp = data.timestamp;
        this.showReminder = response.data.reminder;
      } catch (error) {
        console.error('Fehler beim Abrufen des Live-Status:', error);
      }
    },
  },
  mounted() {
    this.fetchLiveStatus();
    setInterval(this.fetchLiveStatus, 10000);
  },
};
</script>
<template>
  <div class="container">
    <div class="dashboard">
      <h1>Smarter Becher Dashboard</h1>
      <div class="status">
        <div class="status-item">
          <span class="label">📦 <strong>Zuletzt getrunken:</strong></span>
          <span class="value">{{ lastDrink }} ml um {{ formatTime(timestamp) }}</span>
        </div>
        <div class="status-item">
          <span class="label">💧 <strong>Heute getrunken:</strong></span>
          <span class="value">{{ totalAmount }} ml</span>
        </div>
        <div class="status-item">
          <span class="label">🎯 <strong>Tagesziel:</strong></span>
          <span class="value">{{ dailyGoal }} ml</span>
        </div>
        <div class="status-item">
          <span class="label">📊 <strong>Fortschritt:</strong></span>
          <span class="value">{{ progressPercentage }}%</span>
        </div>
      </div>
      <div v-if="showReminder" class="reminder">
        ⚠️ <strong>Bitte trinke etwas Wasser!</strong>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.dashboard {
  width: 100%;
  max-width: 600px;
  font-family: Arial, sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #ffffff;
  color: #333333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  overflow: hidden;
}

.dashboard h1 {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  color: #333333;
  margin-bottom: 20px;
  padding: 0 10px;
}

.status-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-item:last-child {
  border-bottom: none;
}

.label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
}

.value {
  font-size: 1.2rem;
  padding-left: 28px;
}

.reminder {
  margin-top: 20px;
  padding: 10px;
  background: #ffeeba;
  color: #856404;
  border: 1px solid #ffeeba;
  border-radius: 5px;
  font-size: 1.1rem;
  text-align: center;
}
</style>