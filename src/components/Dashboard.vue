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
      </div>
      
      <div class="progress-section">
        <h2>Tagesfortschritt</h2>
        <div class="progress-container">
          <div class="progress-bar" :style="{ 
            width: `${Math.min(100, progressPercentage)}%`,
            background: progressBarColor 
          }">
            <span class="progress-text">{{ progressPercentage }}%</span>
          </div>
        </div>
      </div>
      
      <div v-if="showReminder" class="reminder">
        ⚠️ <strong>Bitte trinke etwas Wasser!</strong>
      </div>
      
      <div class="button-container">
        <button class="settings-button" @click="showSettings = true">
          Einstellungen
        </button>
      </div>

      <!-- Settings Modal -->
      <div v-if="showSettings" class="overlay" @click="showSettings = false"></div>
      <Settings
        v-if="showSettings"
        :dailyGoal="dailyGoal"
        :reminderInterval="reminderInterval"
        :isVisible="showSettings"
        @update:dailyGoal="dailyGoal = $event"
        @update:reminderInterval="reminderInterval = $event"
        @reminder-interval-changed="handleReminderIntervalChange"
        @close="showSettings = false"
        @logout="handleLogout"
      />

      <!-- Initial Setup Modal -->
      <InitialSetup
        v-if="showInitialSetup"
        :isVisible="showInitialSetup"
        @save="handleInitialSetup"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Settings from './Settings.vue';
import InitialSetup from './InitialSetup.vue';

export default {
  components: {
    Settings,
    InitialSetup
  },
  data() {
    return {
      showWelcome: true,
      lastDrink: 0,
      totalAmount: 0,
      timestamp: null,
      dailyGoal: 2000,
      showReminder: false,
      reminderTimer: null,
      lastDrinkTime: null,
      previousAmount: 0,
      reminderInterval: 60,
      showSettings: false,
      showInitialSetup: false  // Neue Property für InitialSetup
    };
  },
  computed: {
    progressPercentage() {
      return ((this.totalAmount / this.dailyGoal) * 100).toFixed(1);
    },
    progressBarColor() {
      const progress = this.totalAmount / this.dailyGoal;
      if (progress < 0.25) return 'linear-gradient(90deg, #ff4d5e, #ff6b7d)';
      if (progress < 0.5) return 'linear-gradient(90deg, #ffd54f, #ffe082)';
      if (progress < 0.75) return 'linear-gradient(90deg, #4dd4e9, #7de2f1)';
      return 'linear-gradient(90deg, #34ce57, #5be07d)';
    }
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
      this.showReminder = timeDiff >= (this.reminderInterval * 60000);
    },
    async fetchLiveStatus() {
      try {
        const response = await axios.get('https://thankful-ocean-0345cfc1e.4.azurestaticapps.net/api/liveStatus');
        const data = response.data.latestData;
        
        if (data.getrunken > this.totalAmount) {
          this.lastDrinkTime = new Date();
          this.showReminder = false;
        }
        
        this.totalAmount = data.getrunken || 0;
        this.lastDrink = data.differenz || 0;
        this.timestamp = data.timestamp;
      } catch (error) {
        console.error('Fehler beim Abrufen des Live-Status:', error);
      }
    },
    startReminderCheck() {
      if (this.reminderTimer) {
        clearInterval(this.reminderTimer);
      }
      this.reminderTimer = setInterval(this.checkInactivity, 10000);
    },
    handleReminderIntervalChange() {
      this.startReminderCheck();
    },
    saveSettings() {
      localStorage.setItem('waterTrackerSettings', JSON.stringify({
        dailyGoal: this.dailyGoal,
        reminderInterval: this.reminderInterval
      }));
    },
    loadSettings() {
      const savedSettings = localStorage.getItem('waterTrackerSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.dailyGoal = settings.dailyGoal;
        this.reminderInterval = settings.reminderInterval;
      }
    },
    handleLogout() {
      this.$emit('logout');
      this.showSettings = false;
    },
    // Neue Methode für InitialSetup
    handleInitialSetup(settings) {
      this.dailyGoal = settings.dailyGoal;
      this.reminderInterval = settings.reminderInterval;
      this.saveSettings();
      this.showInitialSetup = false;
}
  },
  mounted() {
    // Prüfe ob bereits Einstellungen existieren
    const savedSettings = localStorage.getItem('waterTrackerSettings');
    if (!savedSettings) {
      this.showInitialSetup = true;
    } else {
      this.loadSettings();
    }
    
    this.fetchLiveStatus();
    setInterval(this.fetchLiveStatus, 10000);
    this.startReminderCheck();
    this.lastDrinkTime = new Date();
  },
  beforeUnmount() {
    if (this.reminderTimer) {
      clearInterval(this.reminderTimer);
    }
  },
  watch: {
    dailyGoal() {
      this.saveSettings();
    },
    reminderInterval() {
      this.saveSettings();
    }
  }
};
</script>

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
  border-radius: 36px;
  background: #ffffff;
  color: #333333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  overflow: hidden;
}

.welcome-message {
  position: relative;
  background: #e3f2fd;
  padding: 15px;
  border-radius: 36px;
  margin-bottom: 20px;
  text-align: center;
}

.close-welcome {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
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

.progress-section {
  margin: 30px 20px;
  text-align: center;
}

.progress-section h2 {
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  margin-bottom: 8px;
  color: #333333;
  font-weight: 700;
}

.progress-container {
  width: 90%;
  height: 36px;
  background-color: #f5f5f5;
  border-radius: 36px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.progress-bar {
  height: 100%;
  min-width: 40px;
  border-radius: 36px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
  line-height: 25.2px;
  letter-spacing: 0.009em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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

.settings-button {
  background: hsl(210, 80%, 60%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 36px;
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.settings-button:hover {
  background: #0056b3;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>