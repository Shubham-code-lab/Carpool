<template>
  <div class="d-flex flex-column justify-center h-screen">
    <v-form v-model="valid">
      <div class="h-100 d-flex align-center">
        <v-container class="w-50">
          <!-- <v-row> -->
          <v-row rows="12" md="2">
            <!-- firstname -->
            <v-text-field
              v-model="fromLocationName"
              :rules="fromLocationRules"
              :counter="20"
              label="From Location"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- lastname -->
            <v-text-field
              v-model="toLocationName"
              :rules="toLocationRules"
              :counter="20"
              label="To Location"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- dob -->
            <v-row class="pb-9 pt-2">
              <label class="pl-5">Date of Trip:-</label>

              <Datepicker class="pl-4" v-model="tripDateTime"></Datepicker>
            </v-row>
          </v-row>

          <v-row rows="12" md="2">
            <!-- seats -->
            <v-text-field
              v-model="availableSeats"
              type="Number"
              min="1"
              max="8"
              label="Total Seat Available"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- seats -->
            <v-text-field
              v-model="pricePerSeat"
              type="Number"
              min="0"
              label="Price per seat"
              required
            >
            </v-text-field>
          </v-row>

          <v-btn color="blue darken-1 mt-4" @click="submitForm">
            Confirm Trip
          </v-btn>
          <!-- </v-row> -->
        </v-container>
      </div>
    </v-form>
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

  props:['vehicalId'],
  data: () => ({
    valid: false,
    pricePerSeat: 0,
    availableSeats: 1,
    seatsRules: [
      (v) => v == 0 || "Enter available seats in vehical",
      (v) =>
        v <= 8 && (v => 1) || "Vehical with only 1-8 seats can be register", //TODO:- not gerater than registerd vehical seat
    ],
    fromLocationName: "",
    fromLocationRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 20 || "Location must be less than 20 characters",
    ],
    toLocationName: "",
    toLocationRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 20 || "Location must be less than 20 characters",
    ],
    tripDateTime: null,
    snackbar: false,
    snackbarText: ``,
  }),

  computed: {
    ...mapGetters(["getUserId", "getToken", "getUserIsAuthenticated"]),
  },

  methods: {
    async submitForm() {
      if (!this.valid || this.availableSeats < 1 || this.availableSeats > 8) {
        this.snackbar = true;
        this.snackbarText = "Please enter valid data";
        return;
      }

      this.$store.dispatch("checkTokenExpire");
      
      if (this.getUserIsAuthenticated) {
        console.log("Register Trip data");
        console.log(this.fromLocationName);
        console.log(this.toLocationName);
        console.log(this.tripDateTime);
        console.log(this.tripDateTime.toISOString());
        console.log(this.availableSeats);
        console.log(this.pricePerSeat);
        console.log(this.getToken);
        console.log(this.vehicalId);

        await this.$store
          .dispatch("driver/addTrip", {
            fromLocationName: this.fromLocationName,
            toLocationName: this.toLocationName,
            tripDateTime: this.tripDateTime.toISOString(),
            availableSeats: this.availableSeats,
            pricePerSeat: this.pricePerSeat,
            token: this.getToken,
            vehicalId: this.vehicalId
          })
          .then((result) => {
            console.log("Trip added");
          })
          .catch((err) => {
            console.log("can't add trip", err);
          });
      } else {
        this.snackbar = true;
        this.snackbarText = "You Need to login first";
        //user not authenticated
      }
    },
  },
};
</script>

<style>
</style>