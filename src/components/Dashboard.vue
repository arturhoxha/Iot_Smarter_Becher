<template>
  <div class="dashboard">
    <h1>Smarter Becher Dashboard</h1>
    <div class="status">
      <p>📦 <strong>Gewicht des Glases:</strong> {{ currentWeight }} g</p>
      <p>💧 <strong>Heute getrunken:</strong> {{ totalConsumed }} ml</p>
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
  name: 'Dashboard',
  data() {
    return {
      currentWeight: 0, // Gewicht des Glases
      totalConsumed: 0, // Heute getrunken
      dailyGoal: 2000,  // Tagesziel
      showReminder: false, // Erinnerung, falls Nutzer lange nicht trinkt
    };
  },
  computed: {
    progressPercentage() {
      return ((this.totalConsumed / this.dailyGoal) * 100).toFixed(1);
    },
  },
  methods: {
    async fetchLiveStatus() {
      try {
        const response = await axios.get('/api/live-status');
        this.currentWeight = response.data.weight;
        this.totalConsumed = response.data.consumed;
        this.showReminder = response.data.reminder;
      } catch (error) {
        console.error('Fehler beim Abrufen des Live-Status:', error);
      }
    },
  },
  mounted() {
    // Initial Daten laden
    this.fetchLiveStatus();

    // Daten alle 10 Sekunden aktualisieren
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
  background: #ffffff; /* Ändere Hintergrund zu Weiß */
  color: #333333; /* Dunklere Schriftfarbe für besseren Kontrast */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Leichter Schatten für mehr Tiefe */
}

.dashboard h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #333333; /* Sichtbare Farbe für den Titel */
}

.status p {
  font-size: 1.2rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px; /* Abstand zwischen Icon und Text */
}

.reminder {
  margin-top: 20px;
  padding: 10px;
  background: #ffeeba; /* Gelbe Erinnerungskarte */
  color: #856404;
  border: 1px solid #ffeeba;
  border-radius: 5px;
  font-size: 1.1rem;
  text-align: center;
}

</style>
