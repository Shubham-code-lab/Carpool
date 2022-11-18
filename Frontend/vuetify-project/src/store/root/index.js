import { createStore } from 'vuex';

const store = createStore({
    modules: {
        // coaches: coaches,
        // requests
    },
    state(){
        return{
            userId: undefined,
            UserIsDriver: false,
            isAuthenticated: false
        }
    },
    getters:{
        getUserId(state){
            return state.userId;
        },
        getUserIsCoach(state){
            return state.UserIsCoach;
        }
    },
    mutations:{
        updateUserIsCoach(state){
            state.UserIsCoach = true;
        }
    },
    actions:{
        updateUserIsCoach(context){
            context.commit('updateUserIsCoach');
        }
    }
});


export default store;