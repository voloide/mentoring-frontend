import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Router setup
import store from './stores';   // Pinia store setup
import initializeEncryptedDatabase from './database';  // Database initialization

const setupApp = async () => {
  // Initialize the SQLCipher encrypted database or sql.js for web
  const database = await initializeEncryptedDatabase();

  // Create the Vue app
  const app = createApp(App);

  // Inject the database into the app
  app.config.globalProperties.$database = database;

  // Use the router and store
  app.use(router);
  app.use(store);

  // Mount the app
  app.mount('#app');
};

setupApp();
