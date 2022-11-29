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
		expansionVisible: {
			default: true,
			type: Boolean
		},
		hasMount: {
			default: false,
			type: Boolean
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
	>
		<span v-if="hasMount"><CheckMark class="w-6 h-6" /></span>
	</td>
</template>