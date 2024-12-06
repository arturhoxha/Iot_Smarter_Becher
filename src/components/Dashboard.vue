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
      reminderTimer: null,  // Timer für den Reminder
      lastDrinkTime: null,  // Speichert die Zeit des letzten Getränks
      previousAmount: 0,    // Speichert den vorherigen Wert zum Vergleich
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
    checkInactivity() {
      const now = new Date();
      const lastDrink = this.lastDrinkTime || now;
      const timeDiff = now - lastDrink;
      
      // Zeige Reminder nach 1 Minute (60000 ms)
      this.showReminder = timeDiff >= 60000;
    },
    async fetchLiveStatus() {
      try {
        const response = await axios.get('https://thankful-ocean-0345cfc1e.4.azurestaticapps.net/api/liveStatus');
        const data = response.data.latestData;
        
        // Wenn neue Getränkedaten da sind (mehr getrunken wurde)
        if (data.getrunken > this.totalAmount) {
          this.lastDrinkTime = new Date();  // Setze Timer zurück
          this.showReminder = false;        // Verstecke Reminder
        }
        
        this.totalAmount = data.getrunken || 0;
        this.lastDrink = data.differenz || 0;
        this.timestamp = data.timestamp;
      } catch (error) {
        console.error('Fehler beim Abrufen des Live-Status:', error);
      }
    },
    startReminderCheck() {
      // Prüfe alle 10 Sekunden auf Inaktivität
      this.reminderTimer = setInterval(this.checkInactivity, 10000);
    },
  },
  mounted() {
    this.fetchLiveStatus();
    setInterval(this.fetchLiveStatus, 10000);
    this.startReminderCheck();
    this.lastDrinkTime = new Date(); // Initialisiere mit aktuellem Zeitstempel
  },
  beforeUnmount() {
    // Aufräumen des Timers
    if (this.reminderTimer) {
      clearInterval(this.reminderTimer);
    }
  },
};
</script>

<template>
  <div class="container">
    <div class="dashboard">
      <h1>Smarter Becher Dashboard</h1>
      <div class="status">
        <div class="status-item">
          <span class="label">📦<strong>Zuletzt getrunken</strong></span>
          <span class="value">{{ lastDrink }} ml um {{ formatTime(timestamp) }}</span>
        </div>
        <div class="status-item">
          <span class="label">💧<strong>Heute getrunken</strong></span>
          <span class="value">{{ totalAmount }} ml</span>
        </div>
        <div class="status-item">
          <span class="label">🎯<strong>Tagesziel</strong></span>
          <span class="value">{{ dailyGoal }} ml</span>
        </div>
        <div class="status-item">
          <span class="label">📊<strong>Fortschritt</strong></span>
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
* {
 font-family: 'BDOGrotesk', system-ui, sans-serif;
}
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
  border-radius: 30px;
  background: #ffffff;
  color: #333333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  overflow: hidden;
}

.dashboard h1 {
  line-height: 33.6px;
  margin: 0;
  letter-spacing: -0.009em;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #333333;
  margin-bottom: 20px;
  padding: 0 10px;
}

.status-item {
  padding: 8px;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.status-item:last-child {
  border-bottom: none;
}

.label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
}

.value {
  font-size: 18px;
  padding-left: 32px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
}

.reminder {
  margin-top: 20px;
  padding: 10px;
  background: #fff3c0;
  color: #000000;
  border: 1px solid #dbdbdb;
  border-radius: 20px;
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  text-align: center;
}
</style>