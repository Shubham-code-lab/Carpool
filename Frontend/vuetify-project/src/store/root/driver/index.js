
const driver = {
  namespaced: true,
  state() {
    return {
      d_rating: null,
      d_feedBack: [], //string
      d_totalTrips: 56564,
      d_vehical: [{}],
    };
  },
  getters: {
      driverGetter(state,getters, rootGetters, rootState){
          console.log("driverGetter",state, getters, rootGetters, rootState);
          return "driverGetter";
      }
  },
  mutations: {
      driverMutation(state, payLoad){
          console.log("driverMutation", state, payLoad);
      }
  },
  actions: {
      driverAction(context, payload){
          console.log("driverAction", context, payload);
          context.commit('driverMutation', payload);
      }
  },
};

export default driver;
