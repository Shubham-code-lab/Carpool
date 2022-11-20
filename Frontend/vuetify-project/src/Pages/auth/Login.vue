<template>
<div class="d-flex flex-column justify-center h-screen">
  <v-form v-model="valid">
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
        <v-btn color="blue darken-1 ma-4" @click="submitForm"> Login </v-btn>
        <!-- </v-row> -->
      </v-container>
      <div class="text-center ma-2">
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
    </div>
  </v-form>
  </div>
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
    snackbar: false,
    snackbarText: "",
  }),
  watch: {},
  methods: {
    async submitForm() {
      if (this.valid) {
        await this.$store
          .dispatch("checkUserAuthentication", {
            email: this.email,
            password: this.password,
          })
          .then((result) => {
            const isAuthenticated = this.$store.getters.getUserIsAuthenticated;
            if (isAuthenticated) this.$router.push("/");
          })
          .catch((error) => {
            this.snackbar = true;
            this.snackbarText = error.message;
          });
      }
    },
  },
};
</script>

<style>
</style>