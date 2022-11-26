/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';
import router from './router.js';
import store from './store/root/index.js';

//datepicker
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

//Base Component
// import BaseModel from './components/ui/BaseModel.vue';


// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins' 
import vuetify from './plugins/vuetify'

const app = createApp(App)

//date picker
app.component('Datepicker', Datepicker);

//BaseComponent
// app.component('BaseModel', BaseModel);

//router and store
app.use(router);
app.use(store);

registerPlugins(app)

app
  .use(vuetify)
  .mount('#app')
