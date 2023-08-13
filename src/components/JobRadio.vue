<template>
	<span class="relative inline-block">
		<input 
			class="peer absolute left-[50%] top-[50%] mt-[-7px] ml-[-7px] opacity-0" 
			type="radio" 
			v-model="model" 
			:value="value" 
			name="job" 
			:id="value"
		>
			<label 
				class="p-1 rounded block cursor-pointer border border-transparent peer-checked:border-slate-100" 
				:for="value"
			>
				<img 
					:src="jobImage" 
					:alt="jobName" 
					:title="jobName" 
					class="w-8" 
					:class="{'rotate-45': value === 'CRS'}" 
				/>
			</label>
	</span>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import crsUrl from "@/assets/job-icons/cross.png";
	import alcUrl from "@/assets/job-icons/alchemist.png";
	import armUrl from "@/assets/job-icons/armorer.png";
	import bsmUrl from "@/assets/job-icons/blacksmith.png";
	import crpUrl from "@/assets/job-icons/carpenter.png";
	import culUrl from "@/assets/job-icons/culinarian.png";
	import gsmUrl from "@/assets/job-icons/goldsmith.png";
	import ltwUrl from "@/assets/job-icons/leatherworker.png";
	import wvrUrl from "@/assets/job-icons/weaver.png";

	export default defineComponent({
		name: 'JobRadio',
		emits: ['update:modelValue'],
		props: {
			modelValue: {
				default: "",
				type: String,
			},
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
		},
		data() {
			return {
				jobArr: [
					{
						abbr: "CRS",
						name: "None",
						url: crsUrl,
					},
					{
						abbr: "ALC",
						name: "alchemist",
						url: alcUrl,
					},
					{
						abbr: "ARM",
						name: "armorer",
						url: armUrl,
					},
					{
						abbr: "BSM",
						name: "blacksmith",
						url: bsmUrl,
					},
					{
						abbr: "CRP",
						name: "carpenter",
						url: crpUrl,
					},
					{
						abbr: "CUL",
						name: "culinarian",
						url: culUrl,
					},
					{
						abbr: "GSM",
						name: "goldsmith",
						url: gsmUrl,
					},
					{
						abbr: "LTW",
						name: "leatherworker",
						url: ltwUrl,
					},
					{
						abbr: "WVR",
						name: "weaver",
						url: wvrUrl,
					},
				],
			};
		},
		computed: {
			jobImage() {
				return this.jobArr.find((job) => job.abbr === this.value)?.url;
			},
			jobName() {
				const name = this.jobArr.find((job) => job.abbr === this.value)?.name;
				if (name !== undefined) {
					return this.capitalizeName(name);
				}
			},
			model: {
				get(): any {
					return this.modelValue;
				},
				set(value: any) {
					this.$emit("update:modelValue", value);
				}
			}
		},
		methods: {
			capitalizeName(name: string) {
				const nameArr = name.split(" ");
				const capArr = nameArr.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				const capName = capArr.join(" ");
				return capName;
			}
		}
	});
</script>