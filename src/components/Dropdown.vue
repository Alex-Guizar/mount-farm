<script lang="ts">
import { defineComponent } from 'vue';
import DownChevron from '@/assets/DownChevron.vue';

export default defineComponent({
	components: {
		DownChevron
	},
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
				document.addEventListener('click', this.closeIfClickedOutside);
			} else {
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
		<button 
			@click="toggle"
			class="border border-slate-100 rounded py-1 px-3 flex items-center"
		>{{ describer }} <DownChevron class="w-4 h-4 ml-2" /></button>
		<ul
			v-show="showDropdown"
			class="absolute top-full bg-zinc-800 z-10 border border-zinc-600 rounded max-h-[25rem] overflow-auto whitespace-nowrap"
		><slot></slot></ul>
	</div>
</template>