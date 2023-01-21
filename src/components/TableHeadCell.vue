<script lang="ts">
import { defineComponent } from 'vue'
import { createPopper } from '@popperjs/core';

export default defineComponent({
	props: {
		index: {
			default: 0,
			type: Number
		},
		mountVisible: {
			default: true,
			type: Boolean
		},
		mount: {
			default: {},
			type: Object
		}
	},
	data() {
		return {
			popoverShow: false
		}
	},
	watch: {
		popoverShow(popoverShow) {
			if (popoverShow) {
				document.addEventListener('click', this.closeIfClickedOutside);
			} else {
				document.removeEventListener('click', this.closeIfClickedOutside);
			}
		}
	},
	methods: {
		togglePopover: function() {
			this.popoverShow = !this.popoverShow;
			const mountedRef: any = this.$refs.mountRef;
			const popoverRef: any = this.$refs.popoverRef;
			if (mountedRef) {
				if (this.popoverShow) {
					if (this.$refs.mountRef) {
						createPopper(mountedRef, popoverRef, {
							placement: "bottom"
						});
					}
				}
			}
		},
		closeIfClickedOutside(e: any) {
			const mountRef: any = this.$refs.mountRef;

			if (!mountRef.contains(e.target)) {
				this.popoverShow = false;
			}
		},
		capitalizeName(name: string) {
			const nameArr = name.split(" ");
			const capArr = nameArr.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			const capName = capArr.join(" ");
			console.log(capName);
			return capName;
		}
	}
});
</script>

<template>  
	<th
		v-if="mountVisible"
		class="p-1"
	>
		<a href="#" ref="mountRef" @click="togglePopover()">
			<img :src="mount.Icon" :alt="capitalizeName(mount.Name)" :title="capitalizeName(mount.Name)" class="w-[3rem] max-w-[3rem]">
		</a>
		<div 
			ref="popoverRef" 
			:class="{'hidden': !popoverShow, 'block': popoverShow}" 
			role="tooltip" 
			class="bg-zinc-800 border border-zinc-600 rounded z-10 p-2"
		>
			<img :src="mount.Icon" :alt="mount.Name" :title="mount.Name" class="w-[12rem] max-w-[12rem]">
			<div class="text-base">{{ capitalizeName(mount.Name) }}</div>
		</div>
	</th>
</template>