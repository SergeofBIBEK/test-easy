<template>
	<div id="auth">
    <img src="../assets/logo.png">
		<div id="firebaseui-auth-container"></div>
	</div>
</template>

<script>
import firebase from 'firebase';
import firebaseui from 'firebaseui';

export default {
	name: 'Auth',
	mounted() {
    var uiConfig = {
      signInSuccessUrl: '/editor',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
    },
}
</script>

<style>
	@import "firebaseui/dist/firebaseui.css";

  #auth {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  img {
    height: 250px;
  }
</style>
