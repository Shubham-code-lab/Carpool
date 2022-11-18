import { createRouter, createWebHistory } from 'vue-router';
import NotFound from './Pages/NotFound.vue';
import Home from './Pages/Home.vue';
import FindRide from './Pages/FindRide.vue';
import PublishRide from './Pages/PublishRide.vue';
import RideHistory from './Pages/RideHistory.vue';

const routes = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', name:"home" ,component: Home },
        {path: '/findRide', name:"find-ride", component: FindRide},
        {path: '/publishRide', name:"publish-ride", component: PublishRide},
        {path: '/publishRide', name:"publish-ride", component: PublishRide},
        {path: '/rideHistory', name:'ride-history', component: RideHistory},
        {path: '/:notFound(.*)', component: NotFound},
    ],
});

export default routes;