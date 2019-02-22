import Vue from 'vue';
import Router from 'vue-router';
import Home from './Home';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/resource/:_id',
            name: 'resource',
            props: true,
            // lazy-loading when the route is visited
            component: () => import(/* webpackChunkName: "about" */ './components/PoPResource.vue'),
        },
    ],
});
