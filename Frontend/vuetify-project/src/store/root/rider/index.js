
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
      
    }
  };
  
  export default rider;