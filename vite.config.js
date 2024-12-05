export default {
  server: {
      proxy: {
          '/api': 'http://localhost:7071', // Lokale Azure Functions URL
      },
  },
};
