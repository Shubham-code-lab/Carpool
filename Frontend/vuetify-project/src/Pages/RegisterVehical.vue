<template>
  <div class="">
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

    <div class="text-h4 text-center pa-5">Add new Vehical</div>
    <v-form v-model="valid">
      <div class="h-100 d-flex align-center">
        <v-container class="w-50">
          <!-- <v-row> -->
          <v-row rows="12" md="2">
            <!-- firstname -->
            <v-text-field
              v-model="brand"
              :rules="brandRules"
              :counter="1"
              label="Vehical Brand"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- lastname -->
            <v-text-field
              v-model="model"
              :rules="modelRules"
              :counter="10"
              label="Vehical Model"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- lastname -->
            <v-text-field
              v-model="registrationNumber"
              :rules="registrationNumberRules"
              :counter="8"
              label="Registration Number"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- email -->
            <v-text-field
              v-model="seats"
              type="Number"
              min="1"
              max="8"
              label="Total Seat"
              required
            >
            </v-text-field>
          </v-row>
          <div class="d-flex flex-column align-center">
            <v-btn color="blue darken-1 mt-4" @click="submitForm">
              Register
            </v-btn>
          </div>
          <!-- </v-row> -->
        </v-container>
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      valid: false,
      brand: "",
      model: "",
      registrationNumber: "",
      seats: 0,
      brandRules: [
        (v) => !!v || "Brand is required",
        (v) => v.length >= 1 || "Brand must be greater than a characters",
      ],
      registrationNumberRules: [
        (v) => !!v || "Registration Number is required",
        (v) => v.length == 8 || "Registration Number must be of 8 characters",
      ],
      modelRules: [
        (v) => !!v || "Model is required",
        (v) => v.length >= 1 || "Model must be greater than a characters",
      ],
      seatsRules: [
        (v) => v == 0 || "Enter total seats in vehical",
        (v) => (v<=8) && (v=>1) || "Vehical with only 1-8 seats can be register",
      ],
      snackbar: false,
      snackbarText: ``,
    };
  },

  computed:{
    ...mapGetters(["getUserId", "getToken", "getUserIsAuthenticated"]),
  },
  methods: {
    
    async submitForm() {
      if(!this.valid || this.seats < 1 || this.seats > 8){
         this.snackbar = true;
        this.snackbarText = "Please enter valid data";
        return;
      }
    
      this.$store.dispatch('checkTokenExpire');     
       if (this.getUserIsAuthenticated) {
        await this.$store.dispatch("driver/addVehical", {
          brand: this.brand,
          model: this.model,
          registrationNumber: this.registrationNumber,
          seats: this.seats,
          token: this.getToken
        })
        .then(result=>{
          console.log("vehical added");
        })
        .catch(err=>{
          console.log("can't add vehical", err)
          });
      }
      else{
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