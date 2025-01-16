// components/InitialSetup.vue
<template>
  <div class="modal-container">
    <div class="modal-content">
      <h2>Willkommen! 👋</h2>
      <p class="intro-text">Lass uns deine Einstellungen festlegen.</p>
      
      <div class="setup-form">
        <div class="input-group">
          <label for="dailyGoal">Wie viel möchtest du täglich trinken?</label>
          <div class="input-with-unit">
            <input
              type="number"
              id="dailyGoal"
              v-model.number="settings.dailyGoal"
              min="500"
              max="5000"
              step="100"
            />
            <span class="unit">ml</span>
          </div>
        </div>

        <div class="preset-buttons">
          <button 
            v-for="amount in presets" 
            :key="amount"
            @click="settings.dailyGoal = amount"
            :class="{ active: settings.dailyGoal === amount }"
            class="preset-button"
          >
            {{ amount }}ml
          </button>
        </div>

        <div class="input-group">
          <label for="reminderInterval">Wie oft möchtest du erinnert werden?</label>
          <div class="input-with-unit">
            <input
              type="number"
              id="reminderInterval"
              v-model.number="settings.reminderInterval"
              min="30"
              max="120"
              step="15"
            />
            <span class="unit">Minuten</span>
          </div>
        </div>

        <div class="preset-buttons">
          <button 
            v-for="interval in reminderPresets" 
            :key="interval"
            @click="settings.reminderInterval = interval"
            :class="{ active: settings.reminderInterval === interval }"
            class="preset-button"
          >
            {{ interval }} min
          </button>
        </div>

        <button class="save-button" @click="saveAndClose">
          Los geht's!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InitialSetup',
  data() {
    return {
      settings: {
        dailyGoal: 2000,
        reminderInterval: 60
      },
      presets: [1500, 2000, 2500, 3000],
      reminderPresets: [30, 45, 60, 90]
    }
  },
  methods: {
    saveAndClose() {
      this.$emit('save', this.settings);
    }
  }
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 36px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.intro-text {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 18px;
}

.setup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group label {
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  font-weight: 700;
  color: #333;
  font-weight: 500;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  color: whitesmoke;
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 36px;
  font-size: 16px;
  line-height: 25.2px;
  letter-spacing: 0.009em;
  font-weight: 400;
  width: 100%;
}

.unit {
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  font-weight: 700;
  color: #666;
  min-width: 40px;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}

.preset-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 36px;
  background: white;
  color: black;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preset-button.active {
  background: hsl(210, 80%, 60%);
  color: white;
  border-color: hsl(210, 80%, 60%);
}

.save-button {
  background: hsl(210, 80%, 60%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 36px;
  font-size: 18px;
  line-height: 25.2px;
  margin: 0;
  letter-spacing: 0.009em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;
}

.save-button:hover {
  background: hsl(210, 80%, 60%);
}
</style>