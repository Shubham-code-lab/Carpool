
const rider = {
    namespaced: true,
    state() {
      return {
        r_rating: null,
        r_feedBack: [], //string
        r_totalTrips: 0,
      };
    },
    getters: {
        riderGetter(state,getters, rootGetters, rootState){
            console.log("riderGetter state",state);
            console.log("riderGetter getters",getters);
            console.log("riderGetter rootGetters",rootGetters);
            console.log("riderGetter rootState",rootState);
            return "riderGetter";
        }
    },
    mutations: {
        riderMutation(state, payLoad){
            console.log("riderMutation", state, payLoad);
        }
    },
    actions: {
        riderAction(context, payload){
            console.log("riderAction");
            context.commit('riderMutation', context,payload);
        }
    },
    
  };
  
  export default rider;