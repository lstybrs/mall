import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue'
import Home from "../components/home/home";
import Users from "../components/users/users";
import Right from "../components/right/right"
import Role from "../components/right/role"
import List from "../components/goodlist/List";
import Params from '../components/goodlist/Params'
import Cate from "../components/goodlist/Cate";
import Order from '../components/order/Order'
import Report from "../components/report/Report";
import Add from "../components/goodlist/Add"

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
        },
        {
          name:'list',
          path:'/list',
          component:List
        },
        {
          name:'goods',
          path:'/goods',
          component:List
        },
        {
          name:'add',
          path: '/add',
          component: Add
        },
        {
          name:'params',
          path:'/params',
          component:Params
        },
        {
          name:'categories',
          path:'/categories',
          component:Cate
        },
        {
          name:'orders',
          path:'/orders',
          component:Order
        },
        {
          name:'reports',
          path:'/reports',
          component:Report
        },

      ]
    }
  ],
  mode:'history'
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    next()
  }else {
    const token = localStorage.getItem('token')
    if(!token){
      router.push({name:'login'})
      return
    }
     next()
  }
})



export default router
