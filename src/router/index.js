import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Auth from "../views/Auth";
import Registration from "../views/Registration";
import UserList from "../views/UserList";
import Chat from "../views/Chat";

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        name: 'UserList',
        component: UserList,
      },
      {
        path: '/:id',
        name: 'Chat',
        component: Chat,
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.token && localStorage.two_factor) {
      next()
      return
    }
    next('/auth')
  } else {
    next()
  }
})

export default router
