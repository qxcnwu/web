import Vue from 'vue'
import Router from 'vue-router'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import HomeIndex from "../components/HomeIndex";
import BlogEdit from "../components/BlogEdit";
import BlogView from "../components/BlogView";
import Download from "../components/Download";
import DataBase from "../components/DataBase";
import Login from "../components/Login";
import Logout from "../components/Logout";
import Register from "../components/Register";
import BlogShow from "../components/BlogShow";
import BlogEditMain from "../components/BlogEditMain";
import WrongPage from "../components/WrongPage";
import CcDatabase from "../components/CcDatabase";

Vue.use(Router);
Vue.use(mavonEditor);

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'homeindex',
      component: HomeIndex
    },
    {
      path: '/home',
      name: 'homeindex',
      component: HomeIndex
    },
    {
      path: '/homeindex',
      name: 'homeindex',
      component: HomeIndex
    },
    {
      path: '/blogedit/',
      name: 'BlogEdit',
      component: BlogEdit
    },
    {
      path: '/blogview',
      name: 'BlogView',
      component: BlogView
    },
    {
      //路由配置
      path: '/blogshow/:id/',
      name: 'BlogShow',
      component: BlogShow
    },
    {
      path: '/download',
      name: 'Download',
      component: Download
    },
    {
      path: '/database',
      name: 'DataBase',
      component: DataBase
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/editblog/:id/',
      name: 'BlogEditMain',
      component: BlogEditMain
    },
    {
      path: '/wrongPage',
      name: 'wrongPage',
      component: WrongPage
    },
    {
      path: '/ccDatabase',
      name: 'CcDatabase',
      component: CcDatabase
    }
  ]
})
