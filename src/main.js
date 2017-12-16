// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import firebase from 'firebase';

Vue.config.productionTip = false;

var config = {
  apiKey: "AIzaSyC9is7qih5Zx7mJvU-uESiZRW60CwMjkPA",
  authDomain: "test-easy.firebaseapp.com",
  databaseURL: "https://test-easy.firebaseio.com",
  projectId: "test-easy",
  storageBucket: "test-easy.appspot.com",
  messagingSenderId: "708152219971"
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  created() {
      firebase.initializeApp(config);
      firebase.auth().onAuthStateChanged((user) => {
        if (this.$route.name !== "ViewPage") {
          if(user) {
            this.$router.push('/cm');
          } else {
            this.$router.push('/auth');
          }
        }
      });
    },
  router,
  template: '<App/>',
  components: { App }
});