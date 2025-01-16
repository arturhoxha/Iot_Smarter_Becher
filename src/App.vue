// App.vue
<template>
  <div id="app">
    <Login v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    <Dashboard v-else @logout="handleLogout" />
  </div>
</template>

<script>
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';

export default {
  name: 'App',
  components: {
    Login,
    Dashboard
  },
  data() {
    return {
      isAuthenticated: false
    }
  },
  created() {
    // Prüfe beim Start, ob der Benutzer bereits eingeloggt ist
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  },
  methods: {
    handleLoginSuccess() {
      // Beim Login die waterTrackerSettings löschen, damit InitialSetup erscheint
      localStorage.removeItem('waterTrackerSettings');
      this.isAuthenticated = true;
    },
    handleLogout() {
      this.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated');
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'BDOGrotesk', system-ui, sans-serif;
}
</style>