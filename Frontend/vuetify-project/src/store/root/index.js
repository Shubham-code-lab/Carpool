import { createStore } from "vuex";

const store = createStore({
  modules: {
    // coaches: coaches,
    // requests
  },
  state() {
    return {
      //app start set token from local storage and load user data
      userId: undefined,
      token: null,
      tokenExpiryDate: null,
      isAuthenticated: false,
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
  },
  mutations: {
    //state, payload
    updateUserIsAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    checkUserAuthentication(state, payLoad) {
      state.token = payLoad.token;
      state.userId = payLoad.userId;
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
          if (res.status !== 200 && res.status !== 201) {
            console.log("Error!");
            throw new Error("Could not authenticate you!");
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
          //   console.log(err);
          localStorage.clear();
          const error = new Error("authetication fail");
          error.err = err;
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
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Signup fail");
          }
          return res.json();
        })
        .then((resData) => {
          console.log("Signup successfull");
        })
        .catch((err) => {
            const error = new Error("account creation fail");
            error.err = err;
            throw error;
        });
    },
  },
});

export default store;
