<template>
  <div class="text-center w-100 d-flex justify-center mt-12 mb-12">
    <div class="w-50">
      <div class="text-h5 font-weight-medium">
        {{ userIs.toUpperCase() }} :- ({{ name }})
      </div>
      <div class="text-h6 font-weight-medium">Rating</div>
      <v-rating v-model="rating" hover color="amber"></v-rating>
      <div class="text-h6 font-weight-medium">FeedBack</div>
      <v-textarea label="Label" v-model="feedBack"></v-textarea>
      <v-btn color="blue darken-2" @click="rate()">submit</v-btn>
    </div>
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
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  data: () => ({
    rating: 1,
    name: "",
    userIs: "",
    tripId: 0,
    feedBack: "",
    snackbar: false,
    snackbarText: ``,
  }),
  created() {
    this.name = this.$route.query.name;
    this.userIs = this.$route.query.userIs;
    this.tripId = this.$route.query.tripId;
  },
  computed: {
    ...mapGetters(["getUserId", "getToken", "getUserIsAuthenticated"]),
  },
  methods: {
    async rate() {
      if (this.feedBack.length > 10) {
        console.log("feedback", this.feedBack);
        await this.$store
          .dispatch("rider/rateUser", {
            token: this.getToken,
            rating: this.rating,
            id: this.id,
            userIs: this.userIs,
            tripId: this.tripId,
            feedBack: this.feedBack,
          })
          .then((result) => {
            console.log(result);
            this.$router.push({ name: "active-trip" });
          })
          .catch((err) => {
            console.log("can't rate review", err);
            this.snackbar = true;
            this.snackbarText = err;
          });
      } else {
        this.snackbar = true;
        this.snackbarText = "feedback should be more than 10 character";
      }
    },
  },
};
</script>

<style>
</style>