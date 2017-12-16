<template>
	<div id="auth">
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
      signInSuccessUrl: '/cm',
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
</style>
