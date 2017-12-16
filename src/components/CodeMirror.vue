<template>
<div>
	<button @click="logout">Logout</button>{{user.displayName}}
	<select v-model="selectedTheme">
		<option v-for="theme in themes" :value="theme" :key="theme">{{theme}}</option>
	</select>
	Word Wrap?<input type="checkbox" v-model="wordWrap"> <button v-if="url" @click="shipToFirebase">Save</button>
	<codemirror @change="updateCode" :value="code" :options="options"></codemirror>
	<div id="setupURL" v-if="!url">
		<div>
			<p>You must create a unique username before continuing.</p>
			<label>Your Unique Username: <input v-model="enteredURL" type="text"></label>
			<button @click="saveURL">Save</button>
			<span style="color: #F00;">Cannot be changed later!</span>
		</div>
	</div>
</div>
</template>

<script>
import firebase from "firebase";
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/htmlmixed/htmlmixed");

let authVue = {
	name:"CodeMirror",
	data () {
			return {
				selectedTheme: "mdn-like",
				lineNumbers: true,
				highlightSelectionMatches: true,
				styleActiveLine: true,
				autoCloseBrackets: true,
				wordWrap: false,
				user: {},
				url: '',
				enteredURL: '',
				signedIn: false,
				code: '<html>\n  <head>\n    <style>\n      .app {\n        color: red;\n      }\n    </style>\n  </head>\n  <body>\n    <script>\n      var myel = document.getElementById("myEl"); \n    <\/script>\n  </body>\n</html>',
				themes: [
						"none",
						"3024-day",
						"3024-night",
						"abcdef",
						"ambiance",
						"base16-dark",
						"base16-light",
						"bespin",
						"blackboard",
						"cobalt",
						"colorforth",
						"dracula",
						"duotone-dark",
						"duotone-light",
						"eclipse",
						"erlang-dark",
						"hopscotch",
						"icecoder",
						"isotope",
						"lesser-dark",
						"liquibyte",
						"material",
						"mbo",
						"mdn-like",
						"midnight",
						"monokai",
						"neo",
						"night",
						"panda-syntax",
						"paraiso-dark",
						"paraiso-light",
						"pastel-on-dark",
						"railscasts",
						"rubyblue",
						"seti",
						"solarized",
						"the-matrix",
						"tomorrow-night-bright",
						"tomorrow-night-eighties",
						"ttcn",
						"twilight",
						"vibrant-ink",
						"xq-dark",
						"xq-light",
						"yeti",
						"zenburn"
						]
			}
		},
		computed: {
			options: function () {
					return {
						mode: "htmlmixed",
						theme: this.selectedTheme,
						lineWrapping: this.wordWrap
					}
				},
		},
		methods: {
			saveURL: function (event) {
				if (!this.enteredURL) {
					return;
				}

				firebase.database().ref(`urlList`).once('value').then( 
					(snapshot) => {
						let urlList = snapshot.val() || [];

						if (urlList.indexOf(this.enteredURL) === -1) {
							//good to go, save it!
							urlList.push(this.enteredURL);
							firebase.database().ref(`${this.user.uid}`).update({url: this.enteredURL});
							firebase.database().ref().update({urlList: urlList});
							this.url = this.enteredURL;
						}
						else {
							alert("name already taken!");
						}
					},
					(error) => {
						//some kind of error
						alert(error);
					}
				);
			},
			updateCode: function (event) {
				this.code = event;
			},
			logout: function (event) {
				firebase.auth().signOut();
			},
			shipToFirebase: function (event) {
				let aFileParts = [this.code];
				console.log(this.code);
				let oMyBlob = new Blob(aFileParts, {type : 'text/html'});
				
				firebase.storage().ref().child(`${this.url}/test.html`).put(oMyBlob).then(function(snapshot) {
					console.log("file uploaded", snapshot);
  			});
			}
		},
		components: {
			codemirror
		},
		mounted() {
			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					this.user = user;
					this.signedIn = true;

					firebase.database().ref(`${user.uid}/url`).once('value', (snapshot) => {
						let url = snapshot.val();

						if (url) {
							this.url = url;
						}
					});

				}
				else {
					this.user = {};
					this.signedIn = false;
				}
			});
		}
}

export default authVue;
</script>

<style>
@import "codemirror/theme/3024-day.css";
@import "codemirror/theme/3024-night.css";
@import "codemirror/theme/abcdef.css";
@import "codemirror/theme/ambiance.css";
@import "codemirror/theme/base16-dark.css";
@import "codemirror/theme/base16-light.css";
@import "codemirror/theme/bespin.css";
@import "codemirror/theme/blackboard.css";
@import "codemirror/theme/cobalt.css";
@import "codemirror/theme/colorforth.css";
@import "codemirror/theme/dracula.css";
@import "codemirror/theme/duotone-dark.css";
@import "codemirror/theme/duotone-light.css";
@import "codemirror/theme/eclipse.css";
@import "codemirror/theme/erlang-dark.css";
@import "codemirror/theme/hopscotch.css";
@import "codemirror/theme/icecoder.css";
@import "codemirror/theme/isotope.css";
@import "codemirror/theme/lesser-dark.css";
@import "codemirror/theme/liquibyte.css";
@import "codemirror/theme/material.css";
@import "codemirror/theme/mbo.css";
@import "codemirror/theme/mdn-like.css";
@import "codemirror/theme/midnight.css";
@import "codemirror/theme/monokai.css";
@import "codemirror/theme/neo.css";
@import "codemirror/theme/night.css";
@import "codemirror/theme/panda-syntax.css";
@import "codemirror/theme/paraiso-dark.css";
@import "codemirror/theme/paraiso-light.css";
@import "codemirror/theme/pastel-on-dark.css";
@import "codemirror/theme/railscasts.css";
@import "codemirror/theme/rubyblue.css";
@import "codemirror/theme/seti.css";
@import "codemirror/theme/solarized.css";
@import "codemirror/theme/the-matrix.css";
@import "codemirror/theme/tomorrow-night-bright.css";
@import "codemirror/theme/tomorrow-night-eighties.css";
@import "codemirror/theme/ttcn.css";
@import "codemirror/theme/twilight.css";
@import "codemirror/theme/vibrant-ink.css";
@import "codemirror/theme/xq-dark.css";
@import "codemirror/theme/xq-light.css";
@import "codemirror/theme/yeti.css";
@import "codemirror/theme/zenburn.css";

	#setupURL {
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

	#setupURL div {
		background-color: #FFF;
		height: 50vh;
		width: 50vw;
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-direction: column;
	}
</style>
