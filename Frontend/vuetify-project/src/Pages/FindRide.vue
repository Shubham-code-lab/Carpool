<template>
  <div class="d-flex flex-column">
    <v-form>
      <v-container class="">
        <v-row class="">
          <!-- from location -->
          <v-col class="mt-2" cols="12" sm="3">
            <v-text-field label="From location" prepend-icon="mdi-map-marker">
            </v-text-field>
          </v-col>

          <!-- to location -->
          <v-col class="mt-2" cols="12" sm="3">
            <v-text-field label="to Location" prepend-icon="mdi-map-marker">
            </v-text-field>
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
                v-model="slider"
                class="align-center"
                :max="max"
                :min="min"
                :step="1"
                hide-details
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="slider"
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
          <v-btn color="blue darken-2"> Search </v-btn>
          <!-- </v-col> -->
        </div>
      </v-container>
    </v-form>
    <div class="d-flex flex-row bg-red w-75 align-self-center">
      <!-- sorting trips -->
      <div class="w-50 bg-green">ss</div>

      <!-- available trips -->
      <div class="w-50 bg-yellow">
        <v-container>
          <v-card
            class="mt-2"
            v-for="tripDetail in availableTrips"
            :key="tripDetail._id"
            :title="tripDetail.fromLocationName"
          >
            <v-card-text>
              <div></div>
              <div></div>
              <div></div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="blue darken-2">Pick Ride</v-btn>
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
  created() {
    this.availableTrips = this.getAvailableTrips;
  },
  data() {
    return {
      date: null,
      min: 1,
      max: 8,
      slider: 1,
      snackbar: false,
      snackbarText: ``,
      availableTrips: [],
    };
  },
  watch: {
    range(newv, old) {
      console.log(newv);
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