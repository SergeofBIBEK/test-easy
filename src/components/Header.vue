<template>
	<div class="header">
		<div><span style="margin: 10px;">{{projectName}}</span></div>
		<img style="height:50px;" src="../assets/logo.png">
		<div id="userBox">
			<img id="userPhoto" :src="user.photoURL">
			{{user.displayName}}
			<button @click="logout">Logout</button>
		</div>
	</div>
</template>

<script>
import firebase from "firebase";

export default {
	name: "Header",
	props: ['user', 'projectName'],
	methods: {
		logout: function (event) {
			firebase.auth().signOut();
		}
	}
}
</script>

<style scoped>
	.header {
		height: 50px;
    width: 100vw;
    position: fixed;
    background-color: #FFF;
		border-bottom: 1px solid #000;
    z-index: 20;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    display: flex;
		align-items: center;
		justify-content: space-between;
	}

	#userBox {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#userBox * {
		margin: 15px;
	}

	#userPhoto {
		height: 50px;
	}

</style>
