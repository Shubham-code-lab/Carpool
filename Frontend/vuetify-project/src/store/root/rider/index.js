const rider = {
  namespaced: true,
  state() {
    return {
      riderId: null,
      rating: null,
      feedBack: [], //string
      totalTrips: 0,
    };
  },
  getters: {
    getRiderId(state) {
      return state.riderId;
    },
  },
  mutations: {},
  actions: {
    async bookTrip(context, payLoad) {
      console.log("action bookTrip", payLoad);
      return await fetch("http://localhost:8080/rider/bookTrip", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + payLoad.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: payLoad.tripId,
          passengers: payLoad.passengers,
        }),
      })
        .then((res) => {
          console.log("res", res);
          if (res.status != 201) {
            const error = new Error("server error");
            error.res = res;
            throw error;
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Trip booked successfully");
          return resData.msg;
        })
        .catch((error) => {
          console.log(error);
          return error.res.json().then((errData) => {
            throw new Error(errData.message);
          });
        });
    },

    async getScheduleTrips(context, payLoad) {
      console.log("rider action getScheduleTrips", payLoad);
      return await fetch("http://localhost:8080/rider/getScheduleTrips", {
        method: "get",
        headers: {
          Authorization: "Bearer " + payLoad.token,
        },
      })
        .then((res) => {
          console.log("res", res);
          if (res.status != 200) {
            const error = new Error("server error");
            error.res = res;
            throw error;
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Active Trip retrived successfully");
          return resData.activeTrips;
        })
        .catch((error) => {
          console.log(error);
          return error.res.json().then((errData) => {
            throw new Error(errData.message);
          });
        });
    },

    async startTrip(context, payLoad) {
      console.log("startTrip");
      return await fetch("http://localhost:8080/rider/startTrip", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + payLoad.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: payLoad.tripId,
          activeToken: payLoad.activeToken,
        }),
      })
        .then((res) => {
          console.log("res", res);
          if (res.status != 200) {
            const error = new Error("server error");
            error.res = res;
            throw error;
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Trip started successfully");
          return "Token verified";
        })
        .catch((error) => {
          console.log(error);
          return error.res.json().then((errData) => {
            throw new Error(errData.message);
          });
        });
    },

    async getActiveTrips(constext, payLoad) {
      return await fetch("http://localhost:8080/rider/getActiveTrips", {
        method: "get",
        headers: {
          Authorization: "Bearer " + payLoad.token,
        },
      })
        .then((res) => {
          console.log("res", res);
          if (res.status != 200) {
            const error = new Error("server error");
            error.res = res;
            throw error;
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Active Trip retrived successfully");
          return { activeTrip: resData.activeTrip, userIs: resData.userIs };
        })
        .catch((error) => {
          console.log(error);
          return error.res.json().then((errData) => {
            throw new Error(errData.message);
          });
        });
    },

    async rateUser(constext, payLoad) {
      console.log(payLoad);
      return await fetch("http://localhost:8080/rider/rateUser", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + payLoad.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payLoad
        }),
      })
        .then((res) => {
          console.log("res", res);
          if (res.status != 200) {
            const error = new Error("server error");
            error.res = res;
            throw error;
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Active Trip retrived successfully");
          return resData.msg;
        })
        .catch((error) => {
          console.log(error);
          return error.res.json().then((errData) => {
            throw new Error(errData.message);
          });
        });
    },

    async finishTrip(constext, payLoad){
      console.log(payLoad);
      return await fetch("http://localhost:8080/rider/finishTrip", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + payLoad.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payLoad
        }),
      })
        .then((res) => {
          console.log("res", res);
          if (res.status != 200) {
            const error = new Error("server error");
            error.res = res;
            throw error;
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Trip Finish successfully");
          return resData.msg;
        })
        .catch((error) => {
          console.log(error);
          return error.res.json().then((errData) => {
            throw new Error(errData.message);
          });
        });
    }

  },
};

export default rider;
