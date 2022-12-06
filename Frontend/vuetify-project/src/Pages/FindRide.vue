<template>
  <div class="d-flex flex-column">
    {{ selectedFromLocation }}{{ selectedToLocation }}
    <v-form>
      <v-container class="">
        <v-row class="">
          <!-- from location -->
          <v-col class="mt-2" cols="12" sm="3">
            <v-select
              clearable
              label="From Location"
              v-model="selectedFromLocation"
              :items="FromLocations"
            ></v-select>
          </v-col>

          <!-- to location -->
          <v-col class="mt-2" cols="12" sm="3">
            <v-select
              clearable
              label="TO Location"
              v-model="selectedToLocation"
              :items="ToLocations"
            ></v-select>
          </v-col>

          <!-- Date -->
          <v-col class="" cols="12" sm="3">
            <v-row rows="12" sm="6" class="pa-3">
              <p class="pl-2">Pick Date</p>
            </v-row>
            <v-row rows="12" sm="6">
              <Datepicker class="pl-4" v-model="date"></Datepicker>
            </v-row>
          </v-col>

          <!-- seats -->
          <v-col class="" cols="12" sm="3">
            <v-row rows="12" sm="6" class="pa-3">
              <p>Passenger</p>
            </v-row>
            <v-row rows="12" sm="6">
              <v-slider
                v-model="passengers"
                class="align-center"
                max="8"
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
        </v-row>
        <!-- search button -->
        <div class="d-flex flex-column justify-center align-center">
          <!-- <v-col class=  "bg-gr`een" cols="12" sm="3"> -->
          <v-btn color="blue darken-2" @click="searchTrips"> Search </v-btn>
          <!-- </v-col> -->
        </div>
      </v-container>
    </v-form>
    <div class="d-flex flex-row w-75 align-self-center">
      <!-- sorting trips -->
      <div class="w-50">
        <v-container>
          <v-card class="mt-2">
            <v-card-title>
              <div class="d-flex flex-row justify-space-between">
                <div class="text-h4">Sort By</div>
                <v-btn @click="sort = null" variant="text">Clear</v-btn>
              </div>
            </v-card-title>

            <v-card-subtitle></v-card-subtitle>

            <v-card-text>
              <v-radio-group v-model="sort">
                <div class="d-flex flex-row justify-space-between">
                  <div class="pl-5">
                    <!-- <div>Lowest price</div> -->
                    <p
                      class="font-weight-light"
                      style="font-size: 20px; line-height: 3em"
                    >
                      Lowest price
                    </p>
                  </div>
                  <div class="pr-5">
                    <div><v-radio value="price"></v-radio></div>
                  </div>
                </div>

                <div class="d-flex flex-row justify-space-between">
                  <div class="pl-5">
                    <p
                      class="font-weight-light"
                      style="font-size: 20px; line-height: 3em"
                    >
                      Earliest departure
                    </p>
                  </div>
                  <div class="pr-5">
                    <div><v-radio value="time"></v-radio></div>
                  </div>
                </div>

                <div class="d-flex flex-row justify-space-between">
                  <div class="pl-5 ">
                    <p
                      class="font-weight-light"
                      style="font-size: 20px; line-height: 3em"
                    >
                      Rating
                    </p>
                  </div>
                  <div class="pr-5">
                    <div><v-radio value="rating"></v-radio></div>
                  </div>
                </div>

                <div class="d-flex flex-row justify-space-between">
                  <div class="pl-5">
                    <p
                      class="font-weight-light"
                      style="font-size: 20px; line-height: 3em"
                    >
                      Available Seats
                    </p>
                  </div>
                  <div class="pr-5">
                    <div><v-radio value="seat"></v-radio></div>
                  </div>
                </div>
              </v-radio-group>
            </v-card-text>

            <!-- <v-card-actions>
            <v-btn @click="sort = null">Click me</v-btn>
          </v-card-actions> -->
          </v-card>
        </v-container>
      </div>

      <!-- available trips -->
      <div class="w-50">
        <v-container>
          <v-card
            class="mt-2"
            v-for="tripDetail in availableTrips"
            :key="tripDetail._id"
          >
            <v-card-title>
              <div class="d-flex flex-row justify-space-between">
                <div class="text-h6">{{ tripDetail.firstName }}</div>
                <div class="d-flex flex-row">
                  <v-rating
                    :model-value="+tripDetail.driverId.rating"
                    color="amber"
                    density="compact"
                    half-increments
                    readonly
                    size="small"
                  ></v-rating>

                  <div class="text-grey ml-2 text-subtitle-2 pt-2">
                    {{ tripDetail.driverId.rating.toFixed(1) }}
                  </div>
                </div>
              </div>
              <v-divider></v-divider>
            </v-card-title>
            <v-card-subtitle>
              <div class="d-flex flex-row justify-center">
                <div class="text-subtitle-1">
                  {{ tripDetail.fromLocationName }}
                </div>
                <span class="pl-8 pr-8" style="font-size: 70px">&#8594;</span>
                <div class="text-subtitle-1">
                  {{ tripDetail.toLocationName }}
                </div>
              </div>
            </v-card-subtitle>
            <v-card-text>
              <div class="d-flex flex-row justify-space-around">
                <div class="pr-4 seperator-right w-50 text-subtitle-2">
                  <p class="text-center">start</p>
                </div>
                <div class="pl-4 seperator-left w-50 text-subtitle-2">
                  <p class="text-center">End</p>
                </div>
              </div>
              <div class="d-flex flex-row justify-space-between">
                <div class="d-flex flex-row seperator-right w-50 justify-space-between">
                  <div class="pl-5 text-subtitle-1">
                    {{
                      new Date(tripDetail.tripEndDateTime)
                        .toLocaleString()
                        .split(",")[0]
                    }}
                  </div>
                  <div class="pr-5  text-subtitle-1">
                    {{
                      new Date(tripDetail.tripEndDateTime)
                        .toLocaleString()
                        .split(",")[1]
                    }}
                  </div>
                </div>
                <div class="d-flex seperator-left w-50 flex-row justify-space-between">
                  <div class="pl-5 text-subtitle-1">
                    {{
                      new Date(tripDetail.tripDateTime)
                        .toLocaleString()
                        .split(",")[0]
                    }}
                  </div>
                  <div class="pr-5 text-subtitle-1">
                    {{
                      new Date(tripDetail.tripDateTime)
                        .toLocaleString()
                        .split(",")[1]
                    }}
                  </div>
                </div>
              </div>
            </v-card-text>

            <v-card-actions>
              <div class="d-flex flex-row justify-space-between w-100">
                <v-btn color="blue darken-2" @click="pickRide(tripDetail._id)"
                  >Pick Ride</v-btn
                >
                <div class="pr-10">
                  <p class="text-center text-subtitle-2">Total Available Seats</p>
                  <div>
                    <p class="text-center text-subtitle-1">{{ tripDetail.availableSeats }}</p>
                   
                   </div>
                </div>
                <div class="text-h6 text-green pr-3">
                  ₹{{ tripDetail.pricePerSeat }}
                </div>
              </div>
            </v-card-actions>
          </v-card>
        </v-container>
      </div>
    </div>
    <!-- snackbar -->
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
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { mapGetters } from "vuex";

export default {
  components: {
    Datepicker,
  },

  data() {
    return {
      date: null,
      passengers: 1,
      selectedFromLocation: "",
      selectedToLocation: "",
      availableTrips: [],
      ToLocations: [],
      FromLocations: [],
      sort: null,
      min: 1,
      max: 8,
      snackbar: false,
      snackbarText: ``,
    };
  },

  created() {
    const searchData = { search: false };
    this.setTrips(searchData);
  },

  methods: {
    searchTrips() {
      if (!this.selectedFromLocation || !this.selectedToLocation) {
        this.snackbar = true;
        this.snackbarText = "please enter start and end point of your journey";
      } else {
        if (this.date) this.date = new Date(this.date).toISOString();
        const searchData = {
          search: true,
          date: this.date || new Date(),
          passengers: this.passengers,
          selectedFromLocation: this.selectedFromLocation,
          selectedToLocation: this.selectedToLocation,
        };
        this.setTrips(searchData);
      }
    },

    pickRide(tripId) {
      console.log("rideId method");
      this.$router.push({ name: "trip-detail", params: { tripId } });
    },

    async setTrips(searchData) {
      //retriving trips
      await this.$store
        .dispatch("setTrips", searchData)
        .then((result) => {
          console.log("Trip retrived");
          this.availableTrips = this.getAvailableTrips;
          if (!searchData.search) {
            this.FromLocations = this.availableTrips.map(
              (availableTrip) => availableTrip.fromLocationName
            );
            this.ToLocations = this.availableTrips.map(
              (availableTrip) => availableTrip.toLocationName
            );
          }
        })
        .catch((err) => {
          console.log("can't retrived Trip", err);
          this.snackbar = true;
          this.snackbarText = err;
        });
    },
  },
  watch: {
    sort(newValue, oldValue) {
      if (!newValue) {
        this.availableTrips.sort();
      } else if (newValue == "price") {
        this.availableTrips.sort((current, next) => {
          if (current.pricePerSeat < next.pricePerSeat) return -1;
          if (current.pricePerSeat > next.pricePerSeat) return 1;
        });
      } else if (newValue == "rating") {
        this.availableTrips.sort((current, next) => {
          if (current.driverId.rating > next.driverId.rating) return -1;
          if (current.driverId.rating < next.driverId.rating) return 1;
        });
      } else if (newValue == "time") {
        this.availableTrips.sort((current, next) => {
          if (
            new Date(current.tripDateTime).getTime() <
            new Date(next.tripDateTime).getTime()
          )
            return -1;
          if (
            new Date(current.tripDateTime).getTime() >
            new Date(next.tripDateTime).getTime()
          )
            return 1;
        });
      } else if (newValue == "seat") {
        this.availableTrips.sort((current, next) => {
          if (current.availableSeats < next.availableSeats) return -1;
          if (current.availableSeats > next.availableSeats) return 1;
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
.seperator-right {
  border-right: 2px solid gray;
}
.seperator-left {
  border-left: 2px solid gray;
}
</style>