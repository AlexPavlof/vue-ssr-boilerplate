export default {
    namespaced: true,
    state:      () => ({
        loading: false,
        data:    '',
    }),
    actions: {
        async fetchData({ commit }) {
            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve('Data!'), ms));
            }

            commit('setLoading', true);

            const result = await timeout(2000);

            commit('setData', result);
            commit('setLoading', false);
        },
    },
    mutations: {
        setLoading(state, value) {
            state.loading = value;
        },

        setData(state, data) {
            state.data = data;
        },
    },
};
