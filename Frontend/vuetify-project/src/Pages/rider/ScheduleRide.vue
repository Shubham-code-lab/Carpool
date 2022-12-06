<template>
  <div>
    <v-container>
      <div v-if="activeTrips && activeTrips.length > 0" class="d-flex">
        <div class="d-flex flex-column">
          <div
            v-for="index in activeTrips.length"
            :key="index"
            class="pr-10 mt-1 text-h4"
          >
            {{ index }}
          </div>
        </div>
        <v-expansion-panels multiple variant="accordion">
          <v-expansion-panel
            v-for="tripDetail in activeTrips"
            :key="tripDetail._id"
          >
            <v-expansion-panel-title>
              <div class="d-flex justify-space-between w-100">
                <div class="d-flex h-100 align-self-center">
                  <div>
                    {{ tripDetail.fromLocationName }}
                  </div>
                  <div class="arrow-parent">
                    <span class="pl-8 pr-8 arrow-child" style="font-size: 35px"
                      >&#8594;</span
                    >
                  </div>
                  <div>
                    {{ tripDetail.toLocationName }}
                  </div>
                </div>

                <div class="d-flex">
                  <div>
                    {{ new Date(tripDetail.tripDateTime).toLocaleString() }}
                  </div>
                  <div class="arrow-parent">
                    <span class="pl-8 pr-8 arrow-child" style="font-size: 35px">
                      &#8212;</span
                    >
                  </div>
                  <div>
                    {{ new Date(tripDetail.tripEndDateTime).toLocaleString() }}
                  </div>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- <div> -->
              <div>
                <div class="text-h4 text-center pa-5">Vehical</div>
                <div class="d-flex justify-space-around">
                  <div>
                    <p class="font-weight-medium text-center">Brand</p>
                    <p class="font-weight-light text-center">
                      {{ tripDetail.vehicalId.brand }}
                    </p>
                  </div>
                  <v-divider vertical></v-divider>
                  <div>
                    <p class="font-weight-medium text-center">Model</p>
                    <p class="font-weight-light text-center">
                      {{ tripDetail.vehicalId.model }}
                    </p>
                  </div>
                  <v-divider vertical></v-divider>
                  <div>
                    <p class="font-weight-medium text-center">Total Seat</p>
                    <p class="font-weight-light text-center">
                      {{ tripDetail.vehicalId.seats }}
                    </p>
                  </div>
                  <v-divider vertical></v-divider>
                  <div>
                    <p class="font-weight-medium text-center">
                      Registration Number
                    </p>
                    <p class="font-weight-light text-center">
                      {{ tripDetail.vehicalId.registrationNumber }}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div class="text-h4 text-center pa-5">Passengers</div>

                <div
                  class="d-flex justify-space-around"
                  v-for="(passenger, i) in tripDetail.bookedSeats"
                  :key="i"
                >
                  <div class="w-25">
                    <p class="font-weight-medium text-center">Name</p>
                    <p class="font-weight-light text-center">
                      {{ passenger.userId.firstName }}
                      {{ passenger.userId.lastName }}
                    </p>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="w-25">
                    <p class="font-weight-medium text-center">rating</p>
                    <p class="font-weight-light text-center">
                      {{ passenger.riderId.rating }}
                    </p>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="w-25">
                    <p class="font-weight-medium text-center">Booked Seats</p>
                    <p class="font-weight-light text-center">
                      {{ passenger.totalSeats }}
                    </p>
                  </div>
                  <v-divider vertical></v-divider>
                  <div class="w-25">
                    <p class="font-weight-medium text-center">Email Address</p>
                    <p class="font-weight-light text-center">
                      <a href="mailto:{{passenger.userId.email}}">{{
                        passenger.userId.email
                      }}</a>
                    </p>
                  </div>
                </div>

                <div class="w-100 d-flex justify-center mt-4">
                  <div class="w-50">
                    <v-text-field clearable label="Enter Token" class="pa-4" v-model="activeToken"></v-text-field>
                    </div>
                    <v-btn color="blue darken-2 mt-7" @click="startTrip(tripDetail._id)">Start Trip</v-btn>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-card v-else>
        <v-card-title>No Available Detail</v-card-title>
        <v-card-subtitle> </v-card-subtitle>
        <v-card-text> </v-card-text>
      </v-card>
    </v-container>
    <!-- snackbar -->
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeTrips: [],
      snackbar: false,
      snackbarText: ``,
      activeToken: null,
    };
  },
  computed: {
    ...mapGetters(["getUserId", "getToken", "getUserIsAuthenticated"]),
  },
  async created() {
    await this.$store
      .dispatch("rider/getScheduleTrips", { token: this.getToken })
      .then((activeTrips) => {
        console.log(activeTrips);
        this.activeTrips = activeTrips;
      })
      .catch((err) => {
        console.log("can't retrive Active Trip", err);
        this.snackbar = true;
        this.snackbarText = err;
      });
  },
  methods:{
    async startTrip(tripId){
      if( !this.activeToken || this.activeToken.length < 0){
          this.snackbar = true;
          this.snackbarText = "please enter token";
          return;
      }
      console.log(tripId);
      await this.$store
        .dispatch("rider/startTrip", {tripId, token: this.getToken, activeToken: this.activeToken})
        .then((result) => {
            console.log(result);
            this.$router.push({name:'active-trip'});
        })
        .catch((err) => {
          console.log("Can't start trip", err);
          this.snackbar = true;
          this.snackbarText = err;
        }); 
    }
  }
};
</script>

<style>
.arrow-parent {
  position: relative;
  width: 40px;
}
.arrow-child {
  position: absolute;
  top: -90%;
  left: -70%;
}
</style>