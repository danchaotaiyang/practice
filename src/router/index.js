import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            component: (resolve) => require(['@/components/index'], resolve)
        },
        {
            path: '/about',
            component: (resolve) => require(['@/components/about'], resolve)
        },
        {
            path: '/tab',
            component: (resolve) => require(['@/components/tab'], resolve)
        },
        {
            path: '/lines',
            component: (resolve) => require(['@/components/lines'], resolve)
        }
    ]
});
