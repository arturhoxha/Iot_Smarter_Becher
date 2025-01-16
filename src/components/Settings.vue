// Settings.vue
<template>
  <div v-if="isVisible" class="settings-panel">
    <div class="settings-header">
      <h2>Einstellungen</h2>
      <button class="close-button" @click="$emit('close')">&times;</button>
    </div>
    <div class="settings-form">
      <div class="setting-item">
        <label for="dailyGoal">Tagesziel</label>
        <div class="input-group">
          <input
            type="number"
            id="dailyGoal"
            v-model.number="localDailyGoal"
            min="500"
            max="5000"
            step="100"
            @change="updateDailyGoal"
          />
          <span class="unit">ml</span>
        </div>
      </div>
     
      <div class="setting-item">
        <label for="reminderInterval">Erinnerungsintervall</label>
        <div class="input-group">
          <input
            type="number"
            id="reminderInterval"
            v-model.number="localReminderInterval"
            min="1"
            max="120"
            step="1"
            @change="updateReminderInterval"
          />
          <span class="unit">Minuten</span>
        </div>
      </div>
    </div>

    <!-- Logout-Section separat von settings-form -->
    <div class="logout-section">
      <button class="logout-button" @click="handleLogout">
        Abmelden
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  props: {
    dailyGoal: {
      type: Number,
      required: true
    },
    reminderInterval: {
      type: Number,
      required: true
    },
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      localDailyGoal: this.dailyGoal,
      localReminderInterval: this.reminderInterval
    };
  },
  methods: {
    updateDailyGoal() {
      this.$emit('update:dailyGoal', this.localDailyGoal);
    },
    updateReminderInterval() {
      this.$emit('update:reminderInterval', this.localReminderInterval);
      this.$emit('reminder-interval-changed', this.localReminderInterval);
    },
    handleLogout() {
      this.$emit('logout');
    }
  },
  watch: {
    dailyGoal(newVal) {
      this.localDailyGoal = newVal;
    },
    reminderInterval(newVal) {
      this.localReminderInterval = newVal;
    }
  }
};
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 20px;
  z-index: 1000;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #ddd;
  border-radius: 36px;
  background: whitesmoke;
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.settings-header h2 {
  line-height: 33.6px;
  margin: 0;
  letter-spacing: -0.009em;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  color: #333333;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  font-weight: 600;
  color: #000000;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 36px;
  font-size: 16px;
  line-height: 25.2px;
  letter-spacing: 0.009em;
  width: 100%;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

.unit {
  font-size: 16px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  color: black;
  min-width: 60px;
}

.close-button {
  background: none;
  border: none;
  font-size: 36px;
  color: black;
  cursor: pointer;
  padding: 5px;
}

.close-button:hover {
  color: #333;
}

/* Neue logout section styles */
.logout-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
  width: 100%;
}

.logout-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 36px;
  font-size: 18px;
  line-height: 25.2px;
  letter-spacing: 0.009em;
  cursor: pointer;
  transition: background-color 0.2s;
  width: auto;
}

.logout-button:hover {
  background: #c82333;
}
</style>