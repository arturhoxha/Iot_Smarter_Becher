<template>
  <div class="dashboard">
    <h1>Smarter Becher Dashboard</h1>
    <div class="status">
      <p>📦 <strong>Zuletzt getrunken:</strong> {{ lastDrink }} ml um {{ formatTime(timestamp) }}</p>
      <p>💧 <strong>Heute getrunken:</strong> {{ totalAmount }} ml</p>
      <p>🎯 <strong>Tagesziel:</strong> {{ dailyGoal }} ml</p>
      <p>📊 <strong>Fortschritt:</strong> {{ progressPercentage }}%</p>
    </div>
    <div v-if="showReminder" class="reminder">
      ⚠️ <strong>Bitte trinke etwas Wasser!</strong>
    </div>
  </div>
</template>

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
  <div class="dashboard">
    <h1>Smarter Becher Dashboard</h1>
    <div class="status">
      <p>📦 <strong>Zuletzt getrunken:</strong> {{ lastDrink }} ml um {{ formatTime(timestamp) }}</p>
      <p>💧 <strong>Heute getrunken:</strong> {{ totalAmount }} ml</p>
      <p>🎯 <strong>Tagesziel:</strong> {{ dailyGoal }} ml</p>
      <p>📊 <strong>Fortschritt:</strong> {{ progressPercentage }}%</p>
    </div>
    <div v-if="showReminder" class="reminder">
      ⚠️ <strong>Bitte trinke etwas Wasser!</strong>
    </div>
  </div>
</template>

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
<style scoped>
.dashboard {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #ffffff;
  color: #333333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.dashboard h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #333333;
}

.status p {
  font-size: 1.2rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
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