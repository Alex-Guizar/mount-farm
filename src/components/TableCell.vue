<script lang="ts">
import { defineComponent } from 'vue'
import CheckMark from '@/assets/CheckMark.vue';

export default defineComponent({
	components: {
		CheckMark
	},
	props: {
		index: {
			default: 0,
			type: Number
		},
		expansion: {
			default: '',
			type: String
		},
		expansionVisible: {
			default: true,
			type: Boolean
		},
		hasMount: {
			default: false,
			type: Boolean
		}
	},
	computed: {
		bgColor() {
			return {
				'bg-[rgba(1,68,33,0.1)]': this.expansion === 'ARR',
				'bg-[rgba(149,206,214,0.1)]': this.expansion === 'HW',
				'bg-[rgba(102,0,0,0.1)]': this.expansion === 'STB',
				'bg-[rgba(95,3,135,0.1)]': this.expansion === 'SHB',
				'bg-[rgba(90,89,89,0.1)]': this.expansion === 'EW'
			};
		}
	},
  created() {
		this.$emit('created');
	}
});
</script>

<template>  
	<td
		v-if="expansionVisible"
		class="text-center h-8 border-l border-r border-zinc-600"
		:class="bgColor"
	>
		<span v-if="hasMount"><CheckMark class="w-6 h-6" /></span>
	</td>
</template>