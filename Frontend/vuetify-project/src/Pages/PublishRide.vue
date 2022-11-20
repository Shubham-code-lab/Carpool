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
                    {{ vehical.totalSeat }}
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
      </div>
    </div>
    <div class="w-100">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vehicals: [
        {
          _id: 3545,
          brand: "Toyota",
          model: "cruser",
          totalSeat: 4,
          registrationNumber: "343tdfgrt4",
        },
        {
          _id: 35467,
          brand: "Suzuki",
          model: "Maruti",
          totalSeat: 4,
          registrationNumber: "343tdfgrt4",
        },
      ],
      toggleAddVehical: false,
    };
  },
  methods: {
    toggleAddVehicalMethod() {
      this.toggleAddVehical = !this.toggleAddVehical;
      if(this.toggleAddVehical)
        this.$router.push({name: "add-vehical"});
      else this.$router.push({name: "publish-ride"});
    },
  },
  computed:{
    btnIcon(){
      if(this.toggleAddVehical)return "mdi-minus"
      else return "mdi-plus";
    }
  }
};
</script>

<style>
</style>