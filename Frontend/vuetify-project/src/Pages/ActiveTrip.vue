<template>
  <div>
    <v-container class="d-flex justify-center">
      <div v-if="activeTrip" class="d-flex flex-column w-50">
        <div>
          <div class="text-center text-h4 font-weight-light mt-4">
            Driver Detail
          </div>
          <v-card class="mx-auto mt-4">
            <v-card-title>
              <div class="d-flex flex-row justify-space-between">
                <div class="text-h6 font-weight-light">
                  {{ activeTrip.driverId.userId.firstName }}
                  {{ activeTrip.driverId.userId.lastName }}
                </div>
                <div class="d-flex flex-row">
                  <v-rating
                    :model-value="activeTrip.driverId.rating"
                    color="amber"
                    density="compact"
                    half-increments
                    readonly
                    size="small"
                  ></v-rating>

                  <div class="text-grey ml-2 text-subtitle-2 pt-2">
                    {{ activeTrip.driverId.rating.toFixed(1) }}
                  </div>
                </div>
              </div>
            </v-card-title>
            <v-card-subtitle>
              <v-divider></v-divider>
              <div>Gender :- {{ activeTrip.driverId.userId.gender }}</div>
              <div>
                Age :- {{ getAge(activeTrip.driverId.userId.dateOfBirth) }}
              </div>
              <v-divider></v-divider>
            </v-card-subtitle>
            <v-card-text>
              <div>
                <div>
                  email :-
                  <a href="mailto:{{activeTrip.driverId.userId.email}}">{{
                    activeTrip.driverId.userId.email
                  }}</a>
                </div>
                <div>
                  Total Ride As Driver :- {{ activeTrip.driverId.totalTrips }}
                </div>
                <v-divider></v-divider>
                <div class="mt-3">
                  <v-expansion-panels>
                    <v-expansion-panel title="FeedBack">
                      <v-expansion-panel-text
                        v-for="(feedback, index) in activeTrip.driverId
                          .feedBack"
                        :key="index"
                        >{{ feedback }}</v-expansion-panel-text
                      >
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="blue darken-2"
                @click="
                  rateDriver(
                    activeTrip._id,
                    activeTrip.driverId._id,
                    activeTrip.driverId.userId.firstName +
                      ' ' +
                      activeTrip.driverId.userId.lastName
                  )
                "
                >Rate Driver</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>

        <div>
          <div class="text-center text-h4 font-weight-light mt-4">
            Passenger Detail
          </div>
          <div v-for="passenger in activeTrip.bookedSeats" :key="passenger._id">
            <v-card class="mx-auto mt-4">
              <v-card-title>
                <div class="d-flex flex-row justify-space-between">
                  <div class="text-h6 font-weight-light">
                    {{ passenger.userId.firstName }}
                    {{ passenger.userId.lastName }}
                  </div>
                  <div class="d-flex flex-row">
                    <v-rating
                      :model-value="passenger.riderId.rating"
                      color="amber"
                      density="compact"
                      half-increments
                      readonly
                      size="small"
                    ></v-rating>

                    <div class="text-grey ml-2 text-subtitle-2 pt-2">
                      {{ passenger.riderId.rating.toFixed(1) }}
                    </div>
                  </div>
                </div>
              </v-card-title>
              <v-card-subtitle>
                <v-divider></v-divider>
                <v-divider></v-divider>
                <div>Gender :- {{ passenger.userId.gender }}</div>
                <div>Age :- {{ getAge(passenger.userId.dateOfBirth) }}</div>
                <v-divider></v-divider>
                <v-divider></v-divider>
              </v-card-subtitle>
              <v-card-text>
                <div>
                  <div>
                    email :-
                    <a href="mailto:{{passenger.userId.email}}">{{
                      passenger.userId.email
                    }}</a>
                  </div>
                  <div>
                    Total Ride As Driver :- {{ passenger.riderId.totalTrips }}
                  </div>
                  <v-divider></v-divider>
                  <div class="mt-3">
                    <v-expansion-panels>
                      <v-expansion-panel title="FeedBack">
                        <v-expansion-panel-text
                          v-for="(feedback, index) in passenger.riderId
                            .feedBack"
                          :key="index"
                          >{{ feedback }}</v-expansion-panel-text
                        >
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="blue darken-2"
                  @click="
                    ratePassenger(
                      activeTrip._id,
                      passenger.riderId._id,
                      passenger.userId.firstName +
                        ' ' +
                        passenger.userId.lastName
                    )
                  "
                  >Rate Passenger</v-btn
                >
              </v-card-actions>
            </v-card>
          </div>
        </div>
        <div class="w-100 d-flex justify-center mt-6">
          <v-btn class="w-25" color="blue darken-2" @click="finishTrip()"
            >Finish Trip</v-btn
          >
        </div>
      </div>

      <div v-else>
        <v-card>
          <v-card-title>No Available Detail</v-card-title>
          <v-card-subtitle> </v-card-subtitle>
          <v-card-text> </v-card-text>
        </v-card>
      </div>
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
  data: () => ({
    activeTrip: null,
    userIs: ``,
    snackbar: false,
    snackbarText: ``,
  }),

  computed: {
    ...mapGetters(["getUserId", "getToken", "getUserIsAuthenticated"]),
  },

  async created() {
    await this.$store
      .dispatch("rider/getActiveTrips", { token: this.getToken })
      .then((activeTripDetail) => {
        console.log("active driver", activeTripDetail);
        this.activeTrip = activeTripDetail.activeTrip;
        this.userIs = activeTripDetail.userIs;
      })
      .catch((err) => {
        console.log("can't retrive Active Trip", err);
        this.snackbar = true;
        this.snackbarText = err;
      });
  },
  methods: {
    getAge(dob) {
      dob = new Date(dob);
      let diff_ms = Date.now() - dob.getTime();
      let age_dt = new Date(diff_ms);
      return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    ratePassenger(tripId, riderId, name) {
      this.$router.push({
        name: "rate-user",
        params: { id: `${riderId}` },
        query: { userIs: "rider", tripId, name },
      });
    },
    rateDriver(tripId, driverId, name) {
      this.$router.push({
        name: "rate-user",
        params: { id: `${driverId}` },
        query: { userIs: "driver", tripId, name },
      });
    },
    async finishTrip() {
      await this.$store
        .dispatch("rider/finishTrip", { token: this.getToken, userIs:this.userIs, tripId:this.activeTrip._id})
        .then((result) => {
          console.log(result);
          if (this.userIs == "driver") {
            this.$router.push({ name: "driver-history" });
          } else {
            this.$router.push({ name: "home" });     //can't add to riderhistory until all passenger are not active
          }
        })
        .catch((err) => {
          console.log("can't retrive Active Trip", err);
          this.snackbar = true;
          this.snackbarText = err;
        });
    },
  },
};
</script>

<style>
</style>