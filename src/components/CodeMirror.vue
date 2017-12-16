<template>
<div>
	<select v-model="selectedTheme">
		<option v-for="theme in themes" :value="theme" :key="theme">{{theme}}</option>
	</select>
	Word Wrap?<input type="checkbox" v-model="wordWrap">
	<codemirror :value="code" :options="options"></codemirror>
</div>
</template>

<script>
import { codemirror } from "vue-codemirror-lite";
require("codemirror/mode/htmlmixed/htmlmixed");

export default {
	name:"CodeMirror",
	data () {
			return {
				selectedTheme: "mdn-like",
				lineNumbers: true,
				highlightSelectionMatches: true,
				styleActiveLine: true,
				autoCloseBrackets: true,
				wordWrap: false,
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
		components: {
			codemirror
		}
}
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
</style>
