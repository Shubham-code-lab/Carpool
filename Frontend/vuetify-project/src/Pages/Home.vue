<template>
  <div class="d-flex flex-column mb-6">
    <v-sheet class="ma-2 pa-2">
      <v-carousel
        cycle
        height="400"
        hide-delimiter-background
        show-arrows="hover"
      >
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet  height="100%">
            <v-img
              src="https://picsum.photos/350/165?random"
              min-height="100"
              cover
              class="bg-grey-lighten-2"
            ></v-img>
            <!-- <div class="d-flex fill-height justify-center align-center">
              <div class="text-h2">{{ slide }} Slide</div>
            </div> -->
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-sheet>

    <v-container>
      <v-sheet class="ma-2 pa-2">
        <div class="d-flex justify-space-around mb-6">
          <v-sheet
            v-for="highlighCard in highlighCards"
            :key="highlighCard.title"
            class="ma-2 pa-2"
          >
            <v-card
              :title="highlighCard.title"
              :text="highlighCard.description"
            ></v-card>
          </v-sheet></div
      ></v-sheet>
    </v-container>

    <div class="bg-teal-darken-4">
      <v-container>
        <v-sheet class="ma-2 pa-2 bg-teal-darken-4">
          <div class="d-flex justify-center mb-6 bg-teal-darken-4">
            <v-sheet class="ma-2 pa-2 bg-teal-darken-4">
              <v-img
                src="https://cdn.blablacar.com/kairos/assets/images/phishing-b200bc23cc51c0950d45..svg"
                min-height="150"
                min-width="250"
                cover
                class="bg-grey-lighten-2"
              ></v-img>
            </v-sheet>
            <v-sheet class="ma-2 pa-2 bg-teal-darken-4">
              <div class="text-h4 pa-2">Your safety is our priority</div>
              <div class="text-caption pa-2">
                At BlaBlaCar, we're working hard to make our platform as secure
                as it can be. But when scams do happen, we want you to know
                exactly how to avoid and report them. Follow our tips to help us
                keep you safe.
              </div>
            </v-sheet>
          </div>
        </v-sheet>
      </v-container>
    </div>

    <v-sheet class="ma-2 pa-2">

     </v-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
      highlighCards: [
        {
          title: "Your pick of rides at low prices",
          description:
            "No matter where you’re going, by bus or carpool, find the perfect ride from our wide range of destinations and routes at low prices.",
        },
        {
          title: "Trust who you travel with",
          description:
            "We take the time to get to know each of our members and bus partners. We check reviews, profiles and IDs, so you know who you’re travelling with and can book your ride at ease on our secure platform.",
        },
        {
          title: "Scroll, click, tap and go!    ",
          description:
            "Booking a ride has never been easier! Thanks to our simple app powered by great technology, you can book a ride close to you in just minutes.",
        },
      ],
    };
  },
};
</script>

<style>
</style>