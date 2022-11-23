<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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
		<span v-if="hasMount"><img
      alt="Obtained"
      class="w-6 m-auto"
      src="@/assets/green-check.svg"
    /></span>
	</td>
</template>