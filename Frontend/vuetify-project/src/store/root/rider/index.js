
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
        getRiderId(state){
            return state.riderId
        }
    },
    mutations: {
       
    },
    actions: {
      async bookTrip(context, payLoad){
        console.log("action bookTrip", payLoad);
        return await fetch("http://localhost:8080/rider/bookTrip", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + payLoad.token,
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            tripId: payLoad.tripId,
            passengers: payLoad.passengers
          })
        })
        .then(res=>{
          console.log("res", res);
          if(res.status != 201){
            const error = new Error("server error");
            error.res = res;
            throw error;
          }
          return res.json();
        })
        .then(resData=>{
          console.log("Trip booked successfully");
          return resData.msg;
        })
        .catch(error=>{
          console.log(error);
          return error.res.json().then(errData=>{
            throw new Error(errData.message);
          })
        })
      },
    }
  };
  
  export default rider;