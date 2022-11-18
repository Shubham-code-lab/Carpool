<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>

        <v-toolbar-title>
          <router-link to="/"> Carpool </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="text" icon="mdi-magnify"></v-btn>

        <v-btn variant="text" icon="mdi-filter"></v-btn>

        <v-btn variant="text" @click="threeDotsToggle" icon="mdi-dots-vertical">
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" location="left" permanent>

        
        <div class="d-flex flex-column">
          <router-link class="pa-4 d-block" :to="findRideLink">
            Find Ride
          </router-link>
          <router-link class="pa-4 d-block" :to="publishRide">
            Publish Ride
          </router-link>
          <router-link class="pa-4 d-block" :to="rideHistory">
           Ride History
          </router-link>
        </div>
      </v-navigation-drawer>

      <SideBar v-if="threeDotProfile" />

      <v-main>
        <router-view v-slot="slotProps">
          <transition name="route" mode="out-in">
            <component :is="slotProps.Component"></component>
          </transition>
        </router-view>
      </v-main>
    </v-layout>
  </v-card>
</template> 

<script>
import SideBar from "./components/navigation/SideBar.vue";

export default {
  components: {
    SideBar,
  },
  data: () => ({
    threeDotProfile: false,
    drawer: false,
    group: null,
    sideBarLinks: ["findRide", "findRide", "findRide", "findRide"],
  }),

  methods: {
    threeDotsToggle() {
      this.threeDotProfile = !this.threeDotProfile;
    },
  },

  watch: {
    group() {
      this.drawer = false;
    },
  },

  computed: {
    findRideLink() {
      return { name: "find-ride" };
    },
    publishRide() {
      return { name: "publish-ride" };
    },
    rideHistory() {
      return { name: "ride-history" };
    },
  },
};
</script>

<style>
.route-enter-from,
.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.route-enter-active {
  transition: all 0.3s ease-out;
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

div.flex-column a.router-link-active {
  background: #90caf9;
}
</style>