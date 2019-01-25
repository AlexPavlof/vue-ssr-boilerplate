/* eslint-disable no-underscore-dangle,consistent-return,no-return-assign,no-console */
import Vue           from 'vue';
import { createApp } from './app';

const appSelector            = '#app';
const appElement             = document.querySelector(appSelector);
const { app, router, store } = createApp();

if (!appElement) {
    throw new Error('Root element not exist.');
}

if (window && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

Vue.mixin({
    /**
     * Prefetch data before mounting component.
     */
    beforeMount() {
        const { asyncData } = this.$options;

        if (asyncData) {
            this.dataPromise = asyncData({
                store: this.$store,
                route: this.$route,
            });
        }
    },

    /**
     * Prefetch data before updating the route.
     */
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = this.$options;

        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to,
            }).then(next).catch(next);
        } else {
            next();
        }
    },
});

router.onReady(() => {
    app.$mount(appSelector);
});
