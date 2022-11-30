<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		index: {
			default: 0,
			type: Number
		},
		memberVisible: {
			default: true,
			type: Boolean
		}
	},
  created() {
		this.$emit('created');
	}
});
</script>

<template>  
	<tr class="hover:bg-[rgb(49,55,68)]" :class="{ 'bg-zinc-800': index % 2 }" v-if="memberVisible">
		<slot></slot>
	</tr>
</template>