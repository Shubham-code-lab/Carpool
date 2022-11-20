import { createRouter, createWebHistory } from 'vue-router';
import NotFound from './Pages/NotFound.vue';
import Home from './Pages/Home.vue';
import FindRide from './Pages/FindRide.vue';
import PublishRide from './Pages/PublishRide.vue';
import RideHistory from './Pages/RideHistory.vue';
import Login from './Pages/auth/Login.vue';
import Signup from './Pages/auth/Signup.vue';
import AddVehical from  './Pages/RegisterVehical.vue';

const routes = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', name:"home" ,component: Home },
        {path: '/findRide', name:"find-ride", component: FindRide,},
        {path: '/publishRide', name:"publish-ride", component: PublishRide,
         children: [
                {
                name: 'add-vehical',
                path: 'addVehical',
                component: AddVehical,
                },
            ]
        },
        {path: '/rideHistory', name:'ride-history', component: RideHistory},
        {path: '/login', name:'login', component: Login},
        {path: '/signup', name:'signup', component: Signup},
        {path: '/:notFound(.*)', component: NotFound},
    ],
});

export default routes;