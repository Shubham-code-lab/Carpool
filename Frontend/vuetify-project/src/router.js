import { createRouter, createWebHistory } from 'vue-router';

import Home from './Pages/Home.vue';
import FindRide from './Pages/FindRide.vue';
import NotFound from './Pages/NotFound.vue';

import Login from './Pages/auth/Login.vue';
import Signup from './Pages/auth/Signup.vue';

import RideHistory from './Pages/rider/RideHistory.vue';
import TripDetail from './Pages/rider/TripDetail.vue';

import PublishRide from './Pages/driver/PublishRide.vue';
import AddVehical from  './Pages/driver/RegisterVehical.vue';
import RegisterTrip from './Pages/driver/RegisterTrip.vue';



const routes = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', name:"home" ,component: Home },
        {path: '/signup', name:'signup', component: Signup},
        {path: '/login', name:'login', component: Login},
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
        {path: '/reisterTrip/:vehicalId', name:'register-trip', component: RegisterTrip, props: true},
        {path: '/tripDetail/:tripId', name:'trip-detail', component: TripDetail, props: true},
        {path: '/rideHistory', name:'ride-history', component: RideHistory},
        {path: '/:notFound(.*)', component: NotFound},
    ],
});

export default routes;