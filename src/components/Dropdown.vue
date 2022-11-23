<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		describer: {
			default: "Select Options",
			type: String
		}
	},
  data() {
		return {
			showDropdown: false
		}
	},
	watch: {
		showDropdown(showDropdown) {
			if (showDropdown) {
				console.log("add listener");
				document.addEventListener('click', this.closeIfClickedOutside);
			} else {
				console.log("remove listener");
				document.removeEventListener('click', this.closeIfClickedOutside);
			}
		}
	},
	methods: {
		toggle() {
			this.showDropdown = !this.showDropdown;
		},
		closeIfClickedOutside(e: any) {
			const dropDown: any = this.$refs.dropdown;

			if (!dropDown.contains(e.target)) {
				this.showDropdown = false;
			}
		}
	}
});
</script>

<template>  
	<div ref="dropdown" class="relative">
		<button @click="toggle">{{ describer }}</button>
		<ul
			v-show="showDropdown"
			class="absolute top-full bg-zinc-800 z-10 border border-zinc-600 rounded max-h-[25rem] overflow-auto whitespace-nowrap"
		><slot></slot></ul>
	</div>
</template>