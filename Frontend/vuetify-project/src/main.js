/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';
import router from './router.js';
import store from './store/root/index.js';

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins' 
import vuetify from './plugins/vuetify'

const app = createApp(App)

//BaseComponent

//router and store
app.use(router);
app.use(store);

registerPlugins(app)

app
  .use(vuetify)
  .mount('#app')
