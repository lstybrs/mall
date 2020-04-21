import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from "../components/home/home";
import Users from "../components/users/users";
import Right from "../components/right/right"
import Role from "../components/right/role"

Vue.use(Router)
 const router = new Router({
  routes: [
    { path: '/',
      redirect: '/login'
    },
    {
      name:'login',
      path: '/login',
      component:Login
    },
    {
      name:'home',
      path: '/home',
      component:Home,
      children:[{
        name:'users',
        path: '/users',
        component:Users
      },
        {
        name:'right',
        path:'/rights',
        component:Right
      },
        {
          name:'role',
          path:'/roles',
          component:Role
        }
      ]
    }
  ],
  mode:'history'
})

router.beforeEach((req,res ,next)=>{
  next()
})



export default router
