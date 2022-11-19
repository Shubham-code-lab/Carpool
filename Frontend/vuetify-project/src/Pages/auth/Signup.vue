<template>
  <div>
    <v-form v-model="valid" class="h-screen">
      <div class="h-100 d-flex align-center">
        <v-container class="w-50">
          <!-- <v-row> -->
          <v-row rows="12" md="2">
            <!-- firstname -->
            <v-text-field
              v-model="firstName"
              :rules="nameRules"
              :counter="10"
              label="First name"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- lastname -->
            <v-text-field
              v-model="lastName"
              :rules="nameRules"
              :counter="10"
              label="Last name"
              required
            >
            </v-text-field>
          </v-row>

          <v-row rows="12" md="2">
            <!-- email -->
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            >
            </v-text-field>
          </v-row>
          <v-row rows="12" md="2">
            <v-row class="pt-5 pb-5">
              <label class="pl-4 pr-2">Gender :-</label>
              <v-radio-group v-model="gender" row>
                <!-- gender -->
                <v-radio label="male" color="blue" value="male"></v-radio>
                <v-radio label="female" color="blue" value="female"></v-radio>
                <v-radio label="other" color="blue" value="other"></v-radio>
              </v-radio-group>
            </v-row>
          </v-row>

          <v-row rows="12" md="2">
            <!-- dob -->
            <v-row class="pb-9 pt-2">
              <label class="pl-5">Date of Birth :-</label>

              <Datepicker class="pl-4" v-model="dateOfBirth"></Datepicker>
            </v-row>
          </v-row>

          <v-row rows="12" md="2">
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
          <v-btn color="blue darken-1" @click="submitForm"> Register </v-btn>
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

export default {
  components: {
    Datepicker,
  },
  data: () => ({
    valid: false,
    firstName: "",
    lastName: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],
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
    gender: "male",
    dateOfBirth: null,
    snackbar: false,
    snackbarText: ``,
  }),
  methods: {
    submitForm() {
      //check for date and valid
      // console.log(this.firstName);
      // console.log(this.lastName);
      // console.log(this.email);
      // console.log(this.password);
      // console.log(this.gender);
      // console.log(this.dateOfBirth);
      // let temp = new Date(this.dateOfBirth);
      // console.log(temp.toISOString());
      // console.log(this.valid);
      if (!this.dateOfBirth || !this.valid) {
        this.snackbar = true;
        this.snackbarText = "Please enter valid data";
      } else {
        try {
          await this.$store
            .dispatch("createUserAccount", {
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email,
              password: this.password,
              gender: this.gender,
              dateOfBirth: this.dateOfBirth,
            })
            .then((result) => {
              // redirect to login
              this.$router.push("/");
            });
        } catch (error) {
          this.snackbar = true;
          this.snackbarText = "Soething went wrong on server";
        }
      }
    },
  },
};
</script>

<style scoped>
</style>