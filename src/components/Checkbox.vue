<template>
	<li class="border-b border-zinc-600 relative">
		<input class="absolute left-3 top-[50%] mt-[-7px]" type="checkbox" v-model="model" :value="value" :name="name" :id="id"><label class="pl-9 pr-4 py-2 block cursor-pointer" :for="id">{{ label }}</label>
	</li>
</template>

<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		name: 'Checkbox',
		emits: ['update:modelValue'],
		props: {
			modelValue: [Array, Boolean],
			label: {
				default: "Checkbox",
				type: String
			},
			value: {
				default: "",
				type: String
			},
			id: {
				default: "",
				type: String
			},
			name: {
				default: "",
				type: String
			}
		},
		computed: {
			model: {
				get(): any {
					return this.modelValue;
				},
				set(value: any) {
					this.$emit("update:modelValue", value);
				}
			}
		}
	});
</script>