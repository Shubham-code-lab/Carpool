<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>

        <v-toolbar-title>
          <router-link class="text-white" to="/"> Carpool </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- login logout -->
        <div class="d-flex flex-row-reverse">
          <!-- <v-sheet class="ma-2 pa-2">
            <v-card> -->
          <v-tabs bg-color="primary">
            <!-- logout user -->
            <div v-if="getUserIsAuthenticated">
              <v-tab class="pa-0">
                <router-link
                  class="pt-4 pb-4 pl-6 pr-6 text-white d-block"
                  :to="publishRide"
                >
                  Publish Ride
                </router-link>
              </v-tab>

              <v-tab class="pa-0">
                <router-link
                  class="pt-4 pb-4 pl-6 pr-6 text-white d-block"
                  to="/"
                  @click="logOutUser"
                >
                  Log Out
                </router-link>
              </v-tab>
            </div>

            <!-- only when login in -->
            <div v-else>
              <v-tab class="pa-0">
                <router-link
                  class="pt-4 pb-4 pl-6 pr-6 text-white d-block"
                  :to="login"
                >
                  Login
                </router-link>
              </v-tab>
              <v-tab class="pa-0">
                <router-link
                  class="pt-4 pb-4 pl-6 pr-6 text-white d-block"
                  :to="signup"
                >
                  SignUp
                </router-link>
              </v-tab>
            </div>
          </v-tabs>

          <!-- </v-card>
          </v-sheet> -->
        </div>

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
          <router-link class="pa-4 d-block" :to="activeDrive">
            Active Drive
          </router-link>
          <router-link class="pa-4 d-block" :to="activeRide">
            Active Ride
          </router-link>
          <router-link class="pa-4 d-block" :to="driveHistory">
            Drive History
          </router-link>
          <router-link class="pa-4 d-block" :to="rideHistory">
            Ride History
          </router-link>
        </div>
      </v-navigation-drawer>

      <!-- User Profile toggle-->
      <SideBar v-if="threeDotProfile" />

      <v-main>
        <!-- <div class=" bg-red"> -->
        <!-- root route component displayed here -->
        <router-view v-slot="slotProps">
          <transition name="route" mode="out-in">
            <component :is="slotProps.Component"></component>
          </transition>
        </router-view>
        <!-- </div> -->
      </v-main>
    </v-layout>
  </v-card>
</template> 

<script>
import SideBar from "./components/navigation/SideBar.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    SideBar,
  },
  created(){  
    this.$store.dispatch('checkTokenExpire');
    
  },
  data: () => ({
    tab: null, //login logout
    threeDotProfile: false,
    drawer: false,
    group: null,
    sideBarLinks: ["findRide", "findRide", "findRide", "findRide"],
  }),

  methods: {
    threeDotsToggle() {
      this.threeDotProfile = !this.threeDotProfile;
    },
    logOutUser() {
      this.$store.dispatch("logOutUser");
    },
  },

  watch: {
    group() {
      this.drawer = false;
    },
  },

  computed: {
    ...mapGetters(["getUserIsAuthenticated"]),
    findRideLink() {
      return { name: "find-ride" };
    },
    publishRide() {
      return { name: "publish-ride" };
    },
    rideHistory() {
      return { name: "ride-history" };
    },
    driveHistory() {
      return { name: "drive-history" };
    },
    activeRide() {
      return { name: "active-ride" };
    },
    activeDrive() {
      return { name: "active-drive" };
    },
    login() {
      return { name: "login" };
    },
    signup() {
      return { name: "signup" };
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