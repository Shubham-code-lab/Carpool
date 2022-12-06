<template>
  <v-container>
    <v-card v-if="tripDetail">
      <v-card-title>Trip Detail</v-card-title>
      <v-card-subtitle> </v-card-subtitle>
      <v-card-text>
        <div class="d-flex flex-column">
          <p class="text-h6">Driver Detail</p>

          <div class="d-flex">
            <p class="text-subtitle-1">Name :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.firstName }} {{ tripDetail.lastName }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">Rating :-</p>
            <v-rating
              :model-value="+tripDetail.driverId.rating"
              color="amber"
              density="compact"
              half-increments
              readonly
              size="small"
            ></v-rating>
            <p>{{ tripDetail.driverId.rating.toFixed(1) }}</p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">Joining Date :-</p>
            <p class="text-subtitle-1">
              {{
                new Date(tripDetail.joiningDate).toLocaleString().split(",")[0]
              }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">Gender :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.gender }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">Total Trips :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.driverId.totalTrips }}
            </p>
          </div>

          <v-divider></v-divider>

          <p class="text-h6">Vehical Detail</p>

          <div class="d-flex">
            <p class="text-subtitle-1">Brand :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.vehicalId.brand }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">Model :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.vehicalId.model }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">Total Seats :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.vehicalId.seats }}
            </p>
          </div>

          <v-divider></v-divider>

          <p class="text-h6">Trip Detail</p>

          <div class="d-flex">
            <p class="text-subtitle-1">From :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.fromLocationName }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">To :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.toLocationName }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">Trip Date and Time :-</p>
            <p class="text-subtitle-1">
              {{ new Date(tripDetail.tripDateTime).toLocaleString() }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">available seats :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.availableSeats }}
            </p>
          </div>

          <div class="d-flex">
            <p class="text-subtitle-1">price per seats :-</p>
            <p class="text-subtitle-1">
              {{ tripDetail.pricePerSeat }}
            </p>
          </div>

          <v-divider></v-divider>

          <p class="text-h6">Number of seats to book</p>

          <div class="w-50">
            <v-col cols="12" sm="6">
              <v-row rows="12" sm="6" class="pa-3">
                <p>Passengers</p>
              </v-row>
              <v-row rows="12" sm="6">
                <v-slider
                  v-model="passengers"
                  class="align-center"
                  :max="+tripDetail.availableSeats"
                  min="1"
                  :step="1"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="passengers"
                      hide-details
                      single-line
                      density="compact"
                      type="number"
                      style="width: 70px"
                    >
                    </v-text-field>
                  </template>
                </v-slider>
              </v-row>
            </v-col>

            <v-col cols="12" sm="6">
              <v-row rows="12" sm="6" class="pa-3">
                <p>Total Price</p>
              </v-row>
              <v-row rows="12" sm="6" class="pa-3">
                <p>₹{{ totalPrice }}</p>
              </v-row>
            </v-col>
          </div>
        </div>
      </v-card-text>

      <v-card-actions> 
        <v-card-actions>
        <v-btn color="blue darken-2" @click="bookTrip"> Book </v-btn>
      </v-card-actions>
      </v-card-actions>
    </v-card>

    <v-card v-else>
      <v-card-title>No Available Detail</v-card-title>
      <v-card-subtitle> </v-card-subtitle>
      <v-card-text> </v-card-text>

      
    </v-card>

    <!-- snackbar -->
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["tripId"],
  async created() {
    await this.$store
      .dispatch("getTripDetail", { tripId: this.tripId })
      .then((tripDetail) => {
        console.log(tripDetail);
        this.tripDetail = tripDetail;
        this.totalPrice = tripDetail.pricePerSeat;
        //use result object
      })
      .catch((err) => {
        console.log("can't retrive Trip", err);
        this.snackbar = true;
        this.snackbarText = err;
      });
  },
  data() {
    return {
      snackbar: false,
      snackbarText: ``,
      tripDetail: null,
      passengers: 1,
      totalPrice: 0,
    };
  },
  watch: {
    passengers(newValue, oldValue) {
      this.totalPrice = this.tripDetail.pricePerSeat * this.passengers;
    },
  },
  methods: {
    async bookTrip() {
      if (!this.getUserIsAuthenticated) {
        this.snackbar = true;
        this.snackbarText = "You need to login in first";
      }
      else{
        await this.$store
        .dispatch("rider/bookTrip", {passengers : this.passengers, tripId:this.tripId, token:this.getToken})
        .then((result) => {
            console.log(result);
            this.$router.push({name:'schedule-ride'});
        })
        .catch((err) => {
          console.log("can't book Trip", err);
          this.snackbar = true;
          this.snackbarText = err;
        });
      }
    },
  },
  computed: {
    ...mapGetters([
      "getUserId",
      "getToken",
      "getUserIsAuthenticated",
      "getAvailableTrips",
    ]),
  },
};
</script>

<style>
</style>