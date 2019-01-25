import Vue       from 'vue';
import VueRouter from 'vue-router';
import Main      from './components/pages/Main.vue';
import NotFound  from './components/pages/error/NotFound.vue';

Vue.use(VueRouter);

export const simpleRoutes = [
    {
        path:      '*',
        name:      '404',
        component: NotFound,
        meta:      {
            title: 'Page not found',
        },
    },
];

export const routes = [
    {
        path:      '/',
        name:      'main',
        component: Main,
        meta:      {
            title: 'Main Page',
        },
    },
];

export default () => new VueRouter({
    mode:   'history',
    routes: routes.concat(simpleRoutes),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        return { x: 0, y: 0 };
    },
});
