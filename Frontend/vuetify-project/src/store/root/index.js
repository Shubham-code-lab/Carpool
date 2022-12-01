import { createStore } from "vuex";
import driver from "./driver/index.js";
import rider from "./rider/index.js";

const store = createStore({
  modules: {
    driver,
    rider,
  },
  state() {
    return {
      //app start set token from local storage and load user data
      userId: undefined,
      token: null,
      tokenExpiryDate: null,
      isAuthenticated: false,
      availableTrips: []
    };
  },
  getters: {
    //state, getters, rootGetterd, rootState
    getUserId(state) {
      return state.userId;
    },
    getToken(state) {
      return state.token;
    },
    getUserIsAuthenticated(state) {
      return state.isAuthenticated;
    },
    getAvailableTrips(state){
      return state.availableTrips;
    }
  },
  mutations: {
    //state, payload
    updateUserIsAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    checkUserAuthentication(state, payLoad) {
      state.token = payLoad.token;
      state.userId = payLoad.userId ? payLoad.userId : state.userId;
      state.isAuthenticated = payLoad.isAuthenticated;
      state.tokenExpiryDate = payLoad.tokenExpiryDate;
      console.log(
        "mutation user authenticared",
        state.token,
        state.userId,
        state.isAuthenticated,
        state.tokenExpiryDate
      );
    },

    logOutUser(state) {
      localStorage.clear();
      state.userId = undefined;
      state.token = null;
      state.tokenExpiryDate = null;
      state.isAuthenticated = false;
    },

    setTrips(state, payLoad){
        state.availableTrips = payLoad.availableTrips;
        console.log("root mutation setTrips", state.availableTrips);
    },

    checkTokenExpire(state, payload){
      
    }

  },
  actions: {
    //context :-{state,getters,rootGetter,rootState,commit,dispatch}, payload
    updateUserIsAuthenticated(context, payLoad) {
      context.commit("updateUserIsAuthenticated", payLoad.isAuthenticated);
    },

    async checkUserAuthentication(context, payLoad) {
      await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: payLoad.email,
          password: payLoad.password,
        }),
      })
        .then((res) => {
          if (res.status === 422) {
            throw new Error("Validation failed.");
          }
          if (res.status === 204) {
            throw new Error("Email id doesn't exist");
          }
          if (res.status === 401) {
            throw new Error("Could not authenticate you!");
          }
          if (res.status === 500) { 
            throw new Error("something wrong on server");
          }
          if (res.status !== 200 && res.status !== 201) {
            console.log("Error!");
            throw new Error("unExpected Error!");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
          //save token and authenticate user
          const token = resData.token;
          const userId = resData.userId;
          const isAuthenticated = true;

          const remainingMilliseconds = 60 * 60 * 1000;
          const tokenExpiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          localStorage.setItem(
            "tokenExpiryDate",
            tokenExpiryDate.toISOString()
          );
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          //save remainingMIlliSeconds

          //mutation
          context.commit("checkUserAuthentication", {
            token,
            userId,
            isAuthenticated,
            tokenExpiryDate,
          });
        })
        .catch((err) => {
          //isAuthetiction = false
          //   console.log(err);
          // localStorage.clear();
          const error = new Error("authetication fail");
          error.message = err;
          throw error;
        });
    },

    async createUserAccount(context, payLoad) {
      await fetch("http://localhost:8080/auth/signup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: payLoad.firstName,
          lastName: payLoad.lastName,
          email: payLoad.email,
          gender: payLoad.gender,
          dateOfBirth: payLoad.dateOfBirth,
          password: payLoad.password,
        }),
      })
        .then((res) => {
          if (res.status === 422) {
            throw new Error("Validation Fail Email Id already exist");
          }
          if (res.status === 500) {
            throw new Error("something wrong on server");
          }
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("unExpected Error!");
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Signup successfull");
        })
        .catch((err) => {
          const error = new Error("account creation fail");
          error.message = err;
          throw error;
        });
    },

    logOutUser(context) {
      context.commit("logOutUser");
    },

    checkTokenExpire(context){
      const token = localStorage.getItem('token');
      const tokenExpiryDate = localStorage.getItem('tokenExpiryDate');

      if(!context.state.token && !token){  //token not exist
        context.commit("logOutUser");
        return;
      }
      if(token && tokenExpiryDate){ //token on localStorage
        context.state.token = token;
        context.state.tokenExpiryDate = new Date(tokenExpiryDate);
        console.log("token expire on",new Date(tokenExpiryDate)); 
        if(new Date().getTime() < context.state.tokenExpiryDate.getTime()){ //token expire
          context.commit("checkUserAuthentication", {
            token,
            userId: null,
            isAuthenticated: true,
            tokenExpiryDate : context.state.tokenExpiryDate,
          });
        }
        else{
          context.commit("logOutUser");
        }
      }
    },

    async setTrips(context,payLoad) {
      console.log("action setTrips", payLoad);
      await fetch("http://localhost:8080/guest/getTrips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          search: payLoad.search,
          date: payLoad.date,
          passengers: payLoad.passengers,
          selectedFromLocation: payLoad.selectedFromLocation,
          selectedToLocation: payLoad.selectedToLocation,
        })
      })
      .then(res=>{
        if(res.status != 200){
          const error = new Error("server error");
          error.res = res;
          throw error;
        }
        return res.json();
      })
      .then(resData=>{
        console.log("Trip retrived successfully");
        context.commit('setTrips', {availableTrips:resData.availableTrips});
      })
      .catch(error=>{
        console.log(error);
        return error.res.json().then(errData=>{
          throw new Error(errData.message);
        })
      })
    },

    async getTripDetail(context, payLoad){
      console.log("action setTripDetail", payLoad);
      return await fetch("http://localhost:8080/guest/getTripDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          tripId: payLoad.tripId,
        })
      })
      .then(res=>{
        console.log("res", res);
        if(res.status != 200){
          const error = new Error("server error");
          error.res = res;
          throw error;
        }
        return res.json();
      })
      .then(resData=>{
        console.log("Trip retrived successfully");
        return resData.tripDetail;
      })
      .catch(error=>{
        console.log(error);
        return error.res.json().then(errData=>{
          throw new Error(errData.message);
        })
      })
    },
}
});

export default store;
