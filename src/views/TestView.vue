<script lang="ts">
import { defineComponent, ref } from 'vue';
import TrackedMounts from '@/json/TrackedMounts.json';

const next = window.requestAnimationFrame ||
   function(cb) { window.setTimeout(cb, 1000/60) }

interface Mount {
  Expansion: string;
  ID: number;
  Icon: string;
  Name: string;
}

interface MountArr extends Array<Mount>{};

export default defineComponent({
	refs: {
		mountMachine: HTMLElement
	},
  data() {
    return {
			options: {
				duration: 3000 + 0 * 700,
				finalPos: 0,
				height: TrackedMounts.length * 128,
			},
      selectedMembers: [] as string[],
      selectedExpansions: [] as string[],
      raidGroupIds: ["25670721", "25670720", "25683726", "35494529", "25051671", "24042012", "28589679", "16412135"] as string[],
      trackedMounts: TrackedMounts as MountArr,
			startedAt: null as any,
			choice: -1 as number,
			totalScroll: 0,
			perView: 1,
			cellHeight: 128 as number,
			autoScroll: 0 as any,
      expansions: [
        {
          ID: 'ARR',
          Name: 'A Realm Reborn'
        },
        {
          ID: 'HW',
          Name: 'Heavensward'
        },
        {
          ID: 'STB',
          Name: 'Stormblood'
        },
        {
          ID: 'SHB',
          Name: 'Shadowbringers'
        },
        {
          ID: 'EW',
          Name: 'Endwalker'
        }
      ]
    };
  },
  mounted() {
  },
  beforeUpdate() {
  },
	computed: {
		slicedMounts() {
			return this.trackedMounts.slice(0, 4);
		},
		imageWrapper() {
			return this.$refs.mountMachine as HTMLElement;
		},
		imageItems() {
			return this.imageWrapper.querySelectorAll("img");
		},
		imageLength() {
			return this.imageItems.length;
		}
	},
  methods: {
		start: function() {

			this.imageWrapper.style.setProperty('--per-view', `${this.perView}`);
			for (let i = 0; i < this.perView; i++) {
				this.imageWrapper.insertAdjacentHTML('beforeend', this.imageItems[i].outerHTML);
			}

			this.autoScroll = setInterval(this.animate, 250);
		},
		animate: function() {
			this.totalScroll++;
			if (this.totalScroll == this.imageLength + 1) {
				clearInterval(this.autoScroll);
				this.totalScroll = 1;
				this.imageWrapper.style.transition = '0s';
				this.imageWrapper.style.top = '0';
				this.autoScroll = setInterval(this.animate, 250);
			}
			// @ts-ignore
			const widthEl: any = this.imageWrapper.querySelector(":first-child")?.offsetWidth;
			this.imageWrapper.style.top = `-${this.totalScroll * widthEl}px`;
			this.imageWrapper.style.transition = '.25s linear';
		},
		slowdown: function() {
			//clearInterval(this.autoScroll);
			this.choice = Math.floor( Math.random() * this.imageLength );
			console.log(this.choice);
			next((timestamp) => {
				const startOffset = 1;
				if (this.startedAt == null) {
					this.startedAt = timestamp;
				}
				const timeDiff = timestamp - this.startedAt;
				const timeRemaining = Math.max(this.options.duration - timeDiff, 0);
				const power = 3;
				const offset = ( Math.pow(timeRemaining, power) / Math.pow(this.options.duration, power) ) * startOffset;

				// const pos = -1 * Math.floor((offset + this.options.finalPos) % this.options.height);

				console.log("======================");
				console.log("timeRemaining: " + timeRemaining);
				console.log("timeRemainingPower: " + Math.pow(timeRemaining, power));
				console.log("durationPower: " + Math.pow(this.options.duration, power))
				console.log("======================");
				console.log(offset);
			});
			// const power = 3;
			// const offset2 = ( Math.pow(timeRemaining, power) / Math.pow(opt.duration, power) ) * 4;
			// const newPos = -1 * Math.floor((opt.height - offset2) % opt.height);
			// console.log(newPos, offset2);
			// this.imageWrapper.style.top = `-${newPos}px`;
		}
  }
});
</script>

<template>
  <main class="pb-20 grow leading-5">
    <div class="pt-8 flex w-full h-full">
      <div class="flex-none">
        <div class="h-14 pl-2 flex items-center text-xl">Mounts</div>
      </div>

			<div>
				<div class="w-[8rem] h-[8rem] overflow-hidden relative">
					<div ref="mountMachine" class="mount-machine absolute top-0">
						<template v-for="mount in slicedMounts">
							<img :src="mount.Icon" :alt="mount.Name" :title="mount.Name" class="w-[12rem] max-w-[8rem]">
						</template>
						<!-- <img :src="slicedMounts[0].Icon" :alt="slicedMounts[0].Name" :title="slicedMounts[0].Name" class="w-[12rem] max-w-[8rem]"> -->
					</div>
				</div>
			</div>
    </div>
		<button @click='start'>start</button>
		<button style="margin-left: 20px;" @click='slowdown'>stop</button>

  </main>
</template>
