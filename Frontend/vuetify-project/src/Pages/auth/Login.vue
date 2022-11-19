<template>
  <v-form v-model="valid" class="h-screen">
    <div class="h-75 d-flex align-center">
      <v-container class="w-50">
        <v-row rows="12" md="6">
          <!-- email -->
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          >
          </v-text-field>
        </v-row>

        <v-row rows="12" md="6">
          <!-- password -->
          <v-text-field
            label="Password"
            type="password"
            hint="Create strong password"
            v-model="password"
            :rules="passwordRules"
            :counter="10"
            required
          >
          </v-text-field>
        </v-row>
        <v-btn color="blue darken-1" @click="submitForm"> Login </v-btn>
        <!-- </v-row> -->
      </v-container>
    </div>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => v.length >= 8 || "Password must be greater than >=8 characters",
    ],
  }),
  watch:{
  },
  methods: {
    async submitForm() {
      if (this.valid) {
        try{
            await this.$store.dispatch("checkUserAuthentication", {email: this.email,password: this.password})
            .then(result=>{
                const isAuthenticated = this.$store.getters.getUserIsAuthenticated;
                if(isAuthenticated)
                    this.$router.push('/');
            })
        }
        catch(error){
            console.log("vue validation fail", error);
        }
      }
    },
  },
};
</script>

<style>
</style>