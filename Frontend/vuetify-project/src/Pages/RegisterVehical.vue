<template>
  <div class="">
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
    };
  },

  methods: {
    ...mapGetters(["getUserId", "getToken", "getUserIsAuthenticated"]),

    async submitForm() {
      //check token expiry
      this.$store.dispatch('checkTokenExpire');
      
      // console.log("skfdklgdgk", this.$store.state.token);
      // console.log("skfdklgdgk", this.getToken());

      if (this.getUserIsAuthenticated()) {
        console.log("hii");
        await this.$store.dispatch("driver/addVehical", {
          brand: this.brand,
          model: this.model,
          registrationNumber: this.registrationNumber,
          seats: this.seats,
          token: this.getToken()
        })
        .then(result=>{
          console.log("vehical added");
        })
        .catch(err=>{
          console.log("can't add vehical", err)
          });
      }
      else{
        console.log("is aAuthenticatio  is fals");
        //user not authenticated
      }
    },
  },
};
</script>

<style>
</style>