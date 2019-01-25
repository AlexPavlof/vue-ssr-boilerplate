import Vue       from 'vue';
import Vuex      from 'vuex';

Vue.use(Vuex);

const createStore = () => new Vuex.Store({
    state:     {},
    actions:   {},
    mutations: {},
});

export default createStore;
