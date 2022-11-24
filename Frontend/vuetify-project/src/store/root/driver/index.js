import { RESOLVE_COMPONENT } from "@vue/compiler-core";

const driver = {
  namespaced: true,
  state() {
    return {
      driverId: null,
      rating: null,
      feedBack: [], //string
      totalTrips: 0,
      vehicals: [],
    };
  },
  getters: {
    getVehicals(state) {
      return state.vehicals;
    },
  },
  mutations: {
    setVehicals(state, payLoad) {
      //set vehical to vuex store driver module state:-vehicals
      state.vehicals = payLoad.vehicals;
      if (state.vehicals && state.vehicals[0] && state.vehicals[0].driverId)
        state.driverId = state.vehicals[0].driverId;
      console.log("driver id  and vehicals", state.driverId, state.vehicals);
    },
  },
  actions: {
    // async callSetVehicals(context) {
    //   const token = context.rootGetters.getToken;
    //   if (token) {
    //     //action :- get data from serve //mutation set data to vehical of vuex store driver module
    //     await context
    //       .dispatch("setVehicals", { token })
    //       .then((result) => {
    //         console.log("successfull callSetVehicals");
    //       })
    //       .catch((err) => {
    //         const error = new Error("cannot fetch vehicals from server");
    //         error.err = err;
    //         throw error;
    //       });
    //   }
    // },

    async addTrip(context, payLoad){
      await fetch("http://localhost:8080/driver/addTrip", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + payLoad.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payLoad }),
      })
      .then(res=>{
        if(res.status === 403){
          throw new Error("Data provided doesn't belong to user");
        }
        else if(res.status === 500){
          throw new Error("Something wrong on server");
        }
        else if(res.status !== 200 || res.status !== 201){
          throw new Error("add trip request failed");
        }
        return res.json();
      })
      .then(resData=>{
        console.log("Trip added successfully");
      })
      .catch(err=>{
        console.log(err);
        throw err;
      })
    },

    async setVehicals(context, payLoad) {
      //get vehical from server
      console.log("payload token set vehical", payLoad.token);
      await fetch("http://localhost:8080/driver/getVehicals", {
        method: "Get",
        headers: {
          Authorization: "Bearer " + payLoad.token,
        },
      })
        .then((res) => {
          console.log("get vehical response", res.status);
          if (res.status == 204 || res.status == 500) {
            console.log("No vehicals");
            return res.json();
          }
          if (res.status == 302) {
            console.log("retrived vehicals");
            return res.json();
          }
        })
        .then((resData) => {
          context.commit("setVehicals", { vehicals: resData.vehicals });
        })
        .catch((err) => {
          console.log("get vehical error", err);
        });
    },

    async addVehical(context, payLoad) {
      //add vehical to server
      //TODO
      console.log("payload", payLoad.token);
      await fetch("http://localhost:8080/driver/addVehical", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + payLoad.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payLoad }),
      })
        .then((res) => {
          if (res.status === 401) {
            throw new Error("Authenticatation fail!!");
          }
          if (res.status === 422) {
            throw new Error("Validation failed.");
          }
          if (res.status === 204) {
            throw new Error("User not found");
          }
          if (res.status === 500) {
            throw new Error("something wrong on server");
          }
          if (res.status !== 200 && res.status !== 201) {
            console.log("Error!", res.status);
            throw new Error("Could not authenticate you!");
          }
          return res.json();
        })
        .then((resData) => {
          console.log("created"); //TODO:- retrive vehical data
        })
        .catch((err) => {
          const error = new Error("fail to add vehical");
          error.message = err;
          throw error;
        });
    },
  },
};

export default driver;
