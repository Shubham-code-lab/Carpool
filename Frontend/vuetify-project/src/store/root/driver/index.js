const driver = {
  namespaced: true,
  state() {
    return {
      driverId: null,
      rating: null,
      feedBack: [], //string
      totalTrips: 56564,
      vehical: [{}],
    };
  },
  getters: {},
  mutations: {},
  actions: {

    async addVehical(context, payLoad) {
      //TODO
      console.log("payload", payLoad.token);
      await fetch("http://localhost:8080/driver/addVehical", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + payLoad.token,
          'Content-Type' : 'application/json'
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
          console.log("created");   //TODO:- retrive vehical data
        });
    },
  },
};

export default driver;
