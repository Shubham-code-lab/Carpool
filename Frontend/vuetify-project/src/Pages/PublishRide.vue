<template>
  <div class="d-flex flex-column align-center">
    <div class="d-flex flex-column w-50">
      <div class="ma-4" v-for="vehical in vehicals" :key="vehical._id">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card v-bind="props" :color="isHovering ? 'primary' : undefined">
              <div class="text-h4 text-center pa-5">
                {{ vehical.brand }}
              </div>
              <div class="d-flex justify-space-around">
                <div>
                  <p class="font-weight-medium text-center">Model</p>
                  <p class="font-weight-light text-center">
                    {{ vehical.model }}
                  </p>
                </div>
                <v-divider vertical></v-divider>
                <div>
                  <p class="font-weight-medium text-center">Total Seat</p>
                  <p class="font-weight-light text-center">
                    {{ vehical.seats }}
                  </p>
                </div>
                <v-divider vertical></v-divider>
                <div>
                  <p class="font-weight-medium text-center">
                    Registration Number
                  </p>
                  <p class="font-weight-light text-center">
                    {{ vehical.registrationNumber }}
                  </p>
                </div>
              </div>
              <!-- button delete and select -->
              <div class="d-flex justify-space-around ma-4">
                <div>
                  <v-btn color="green darken-3" @click="selectVehical(vehical._id)"> Select </v-btn>
                </div>
                <div>
                  <v-btn color="red darken-2" @click="deleteVehical(vehical._id)"> Delete </v-btn>
                </div>
              </div>

            </v-card>
          </template>
        </v-hover>
      </div>
      <div class="ma-4 align-self-center">
        <v-btn
          color="success"
          :icon="btnIcon"
          size="x-large"
          @click="toggleAddVehicalMethod"
        >
        </v-btn>

        <div class="text-center ma-2">
          <v-snackbar v-model="snackbar">
            {{ snackbarText }}
            <template v-slot:actions>
              <v-btn color="pink" variant="text" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </div>
      </div>
    </div>

    <div class="w-100">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      vehicals: [],
      toggleAddVehical: false,
      snackbar: false,
      snackbarText: ``,
    };
  },

  async created() {
    // console.log("publish rider created");
    //  this.$store
    //   .dispatch("driver/callSetVehicals")
    //   .then((result) => {
    //     this.vehicals = this.getVehicals;
    //   })
    //   .catch((err) => {
    //     console.log("fail to get vehicals", err);
    //   });

    this.setVehicals();
  },

  watch: {
    //TODO:- watch a getter of driver module and update when changes
    $route(newRoute) {
      this.setVehicals();
    },
  },

  methods: {

    selectVehical(vehicalId){
      console.log(vehicalId);
      this.$router.push({name: 'register-trip', params:{vehicalId}});
    },

    deleteVehical(vehicalId){
      console.log(vehicalId);
    },

    async setVehicals() {
      if (this.getToken) {
        //action :- get data from serve //mutation set data to vehical of vuex store driver module
        await this.$store
          .dispatch("driver/setVehicals", { token: this.getToken })
          .then((result) => {
            this.vehicals = this.getVehicals;
          })
          .catch((err) => {
            console.log("cannot fetch vehicals from server");
          });
      }
    },

    toggleAddVehicalMethod() {
      if (!this.getUserIsAuthenticated) {
        console.log("toggleAddVehicalMethod not auth");
        this.snackbar = true;
        this.snackbarText = "You Need to login first";
      }

      this.toggleAddVehical = !this.toggleAddVehical;
      if (this.toggleAddVehical) this.$router.push({ name: "add-vehical" });
      else this.$router.push({ name: "publish-rider" });
    },
  },

  computed: {
    ...mapGetters(["getUserId", "getToken", "getUserIsAuthenticated"]),
    ...mapGetters("driver", ["getVehicals"]),
    btnIcon() {
      if (this.toggleAddVehical) return "mdi-minus";
      else return "mdi-plus";
    },
  },
};
</script>

<style>
</style>