<template>
	<div id="loadModal">
		<div>
			<button @click="close" id="closeButton">x</button>
			<label>Filter: <input v-model="filter" type="text"></label>
			<ul>
				<li v-for="page in filteredList" :key="page">
					<span>{{page}}</span>
					<button :page="page" @click="loadThis">Load</button>
					<button :page="page" @click="deleteThis">Delete</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import firebase from 'firebase';

export default {
	name: "Load",
	data: function () {
		return {
			pageList: [],
			filter: ''
		};
	},
	computed: {
		filteredList: function () {
			if (!this.filter) {
				return this.pageList;
			}
			return this.pageList.filter(page => (page.toLowerCase().indexOf(this.filter.toLowerCase()) > -1));
		}
	},
	props: ["setCurrentFile", "close", "url", "user"],
	methods: {
		loadThis: function(event) {
			let page = event.currentTarget.getAttribute('page');

			this.setCurrentFile(page);
		},
		deleteThis: function (event) {
			let page = event.currentTarget.getAttribute('page');

			let newArray = [].concat(this.pageList);
			let index = newArray.indexOf(page);
			newArray.splice(index, 1);

			firebase.database().ref(this.user.uid).update({pages: newArray});
			firebase.storage().ref().child(`${this.url}/${page}.html`).delete();

		}
	},
	mounted() {
		firebase.database().ref(`${this.user.uid}/pages`).on('value', (snapshot) => {
			this.pageList = snapshot.val() || [];
		});
	}
};
</script>

<style scoped>
	#loadModal {
		background-color: rgba(000, 000, 000, 0.8);
		position: fixed;
		top: 0px;
		left: 0px;
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	#loadModal div {
		background-color: #FFF;
		height: 50vh;
		width: 50vw;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
	}

	ul {
		height: 70%;
		overflow: auto;
	}

	#closeButton {
		position: absolute;
		top: 15px;
		right: 15px;
		border: 1px solid #000;
	}
</style>
