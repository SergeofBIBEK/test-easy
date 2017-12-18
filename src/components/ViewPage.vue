<template>
<div>
	{{this.$route.params.user}}
	{{this.$route.params.id}}
	<iframe :src="pageSrc" class="output"></iframe>
</div>
</template>

<script>
import firebase from 'firebase';

export default {
	name: "ViewPage",
	data: function () {
		return {
			pageSrc: ''
		};
	},
	mounted() {
		
		let { user, id } = this.$route.params;
		document.title = id;
		let ref = firebase.storage().ref(`${user}/${id}.html`).getDownloadURL().then(
			(url) => {
				this.pageSrc = url;
			}
		);
	}
}
</script>

<style scoped>
.output {
	position: fixed;
	top: 0px;
	left: 0px;
	height: 100vh;
	width: 100vw;
	border: none;
	background-color: #FFF;
}
</style>
