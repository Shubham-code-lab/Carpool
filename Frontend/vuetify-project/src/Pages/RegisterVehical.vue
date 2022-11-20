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
        <v-btn color="blue darken-1 mt-4" @click="submitForm"> Register </v-btn>
        </div>
        <!-- </v-row> -->
      </v-container>
    </div>
  </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
        valid:false,
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

  methods:{
    submitForm(){
        console.log(this.brand,
      this.model,
      this.registrationNumber,
      this.seats);
      //TODO only when all data is correct
      //state
    //   console.log("this.$store.state",this.$store.state);
    //   console.log("this.$store.state",this.$store.state.rider.r_totalTrips);
    //   console.log("this.$store.state",this.$store.state.driver);
      //getters
      console.log(this.$store.getters.rootGetter);
      console.log(this.$store.getters['rider/riderGetter']);
      console.log(this.$store.getters['driver/driverGetter']);
      //action
      console.log(this.$store.dispatch('rootGetter', {root:"i am root action payload"}));
      console.log(this.$store.dispatch('rider/riderGetter', {rider:"i am rider action payload"}));
      console.log(this.$store.dispatch('driver/driverGetter', {driver:"i am driver action payload"}));
    }
  }
};
</script>

<style>
</style>