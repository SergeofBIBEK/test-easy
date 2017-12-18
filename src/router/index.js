import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import ViewPage from '@/components/ViewPage';
import CodeMirror from "@/components/CodeMirror";
import Auth from "@/components/Auth";
import firebase from 'firebase';

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      redirect: '/auth'
    },
    {
      path: '/:user/:id', //view
      name: 'ViewPage',
      component: ViewPage
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/editor',
      name: 'CodeMirror',
      component: CodeMirror,
    }
  ]
});

export default router;