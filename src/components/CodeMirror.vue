<template>
<div>
	<Header :user="user" :projectName="currentFile"/>
	<div style="height: 50px; position: relative; top: 0; left: 0"></div>
	<div id="contentBody">
		<div id="codeMirrorHolder">
			<label>Theme: 
				<select v-model="selectedTheme">
					<option v-for="theme in themes" :value="theme" :key="theme">{{theme}}</option>
				</select>
			</label>
			<label>Word Wrap?<input type="checkbox" v-model="wordWrap"></label>
			<input v-model="enteredFileName" type="text" placeholder="Name">
			<button v-if="url" @click="shipToFirebase">Save</button><button @click="openLoadModal">Files</button>
			<br />
			<codemirror @change="updateCode" :value="code" :options="options"></codemirror>
		</div>
		<div id="previewHolder" v-if="currentFile">
			<router-link :to="`${url}/${currentFile}`">{{`${url}/${currentFile}`}}</router-link>
			<iframe style="height: 100%; width: 100%; border: 1px solid #000;" :src="`${url}/${currentFile}`"></iframe>
		</div>
	</div>
	<div id="setupURL" v-if="!url">
		<div>
			<p>You must create a unique username before continuing.</p>
			<label>Your Unique Username: <input v-model="enteredURL" type="text" placeholder="Unique Username"></label>
			<button @click="saveURL">Save</button>
			<span style="color: #F00;">Cannot be changed later!</span>
		</div>
	</div>
	<Load v-if="loadModalOpen" :url="url" :close="closeLoadModal.bind(this)" :user="user" :setCurrentFile="setCurrentFile.bind(this)" />
</div>
</template>

<script>
import firebase from "firebase";
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/htmlmixed/htmlmixed");
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/edit/closebrackets.js");
require("codemirror/addon/edit/matchtags.js");
require("codemirror/addon/edit/closetag.js");
require("codemirror/addon/search/match-highlighter.js");
require("codemirror/addon/selection/active-line.js");

import Header from "./Header.vue";
import Load from "./Load.vue";

let authVue = {
	name:"CodeMirror",
	data () {
			return {
				selectedTheme: "mdn-like",
				currentFile: '',
				enteredFileName: '',
				user: {},
				url: 'temp',
				enteredURL: '',
				signedIn: false,
				wordWrap: false,
				loadModalOpen: false,
				code: '<html>\n  <head>\n\n  </head>\n\n  <body>\n\n    <!--Tag Goes Here-->\n\n  </body>\n</html>',
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
						lineWrapping: this.wordWrap,
						lineNumbers: true,
						highlightSelectionMatches: true,
						styleActiveLine: true,
						matchBrackets: true,
						autoCloseBrackets: true,
						matchTags: true,
						autoCloseTags: true,
					}
				},
				filePath: function () {
					return `${this.url}/${this.enteredFileName}.html`;
				}
		},
		methods: {
			closeLoadModal: function () {
				this.loadModalOpen = false;
			},
			openLoadModal: function () {
				this.loadModalOpen = true;
			},
			savePageToList: function (fileName) {
				let userRef = firebase.database().ref(this.user.uid);
				let pagesRef = userRef.child('pages')

				pagesRef.once('value', (snapshot) => {
					let list = snapshot.val() || [];

					if (list.indexOf(fileName) === -1) {
						list.push(fileName);
						userRef.update({pages: list});
					}
				})
			},
			setCurrentFile: function (fileName) {
				this.currentFile = fileName;
				this.enteredFileName = fileName;

				firebase.storage().ref().child(`${this.url}/${fileName}.html`).getDownloadURL().then(
					(url) => {
						var xhr = new XMLHttpRequest();
						xhr.responseType = '';
						xhr.onload = (event) => {
							var blob = xhr.response;
							this.code = blob;
						};
						xhr.open('GET', url);
						xhr.send();
					}
				);

				this.loadModalOpen = false;
			},
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
			shipToFirebase: function (event) {
				if (!this.enteredFileName) {
					return;
				}

				let code = [this.code];
				let file = new Blob(code, {type : 'text/html'});

				firebase.storage().ref().child(this.filePath).getDownloadURL().then(
					(exists) => {
						//Ask if they want to overwrite.
						if (confirm("File already exists, do you want to overwrite? OK: Yes, Cancel: No")) {
							firebase.storage().ref().child(this.filePath).put(file).then(
								(snapshot) => {
									this.setCurrentFile(this.enteredFileName);
									this.savePageToList(this.enteredFileName);
								},
								(error) => {
									alert(error);
								}
							);
						}
					},
					(error) => { //file not found, go ahead and upload
						firebase.storage().ref().child(this.filePath).put(file).then(
							(snapshot) => {
								this.setCurrentFile(this.enteredFileName);
								this.savePageToList(this.enteredFileName);
							},
							(error) => {
								alert(error);
							}
						);
					}
				);
				
				
			}
		},
		components: {
			codemirror,
			Header,
			Load
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

	#contentBody {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
	}

	#codeMirrorHolder {
		width: 450px;
		height: 80vh;
	}

	#previewHolder {
		width: 450px;
		height: 80vh;
	}

	.CodeMirror {
		height: 90%;
		width: 100%;
		border: 1px solid #000;
	}
</style>
