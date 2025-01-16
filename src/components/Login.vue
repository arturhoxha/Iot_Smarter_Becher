// Login.vue
<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Smart Coaster Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            type="text"
            v-model="username"
            placeholder="Benutzername"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            v-model="password"
            placeholder="Passwort"
            required
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" class="login-button">Anmelden</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    handleLogin() {
      if (this.username === 'test' && this.password === 'test') {
        // Erfolgreicher Login
        localStorage.setItem('isAuthenticated', 'true');
        this.$emit('login-success');
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Ungültige Anmeldedaten. Bitte verwenden Sie test/test';
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 36px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 36px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4a90e2;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 36px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover {
  background: #357abd;
}

.error-message {
  color: #ff4444;
  text-align: center;
  margin-bottom: 15px;
  font-size: 14px;
}
</style>