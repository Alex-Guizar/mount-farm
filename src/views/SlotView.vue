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
		slotRefs: "slotRefs"
	},
  data() {
    return {
      slots: [{
        title: "When",
        items: TrackedMounts as MountArr
				// items: [
        // 	"today",
        //   "next week",
        //   "last year",
        //   "tomorrow",
        //   "yesterday",
        // ]
      }],
      opts: null as any,
      startedAt: null as any,
			previousSelection: 0 as number,
			cellHeight: 212 as number,
    }
  },
  mounted() {
		this.slots[0].items = this.slots[0].items.slice(0, 5);
  },
  beforeUpdate() {
  },
  methods: {
    start: function() {
			if (this.opts) {
      	return
      }

      this.opts = this.slots.map( (data, i) => {
				// @ts-ignore
        const slot = this.$refs.slotRefs[i];
        const choice = Math.floor( Math.random() * data.items.length );
        console.log("choice", i, data.items[choice])

				//console.log(this.previousSelection);
        const opts: any = {
        	el: slot.querySelector('.slot__wrap'),
          finalPos: choice * this.cellHeight,
          startOffset: this.previousSelection * this.cellHeight,
          height: data.items.length * this.cellHeight,
          duration: 3000 + i * 700, // milliseconds
          isFinished: false,
        }
				
				//console.log(choice, opts.finalPos);
				//console.log(opts.startOffset);
        this.previousSelection = choice;
        return opts
      });
      
      next( this.animate );
		},
		
		animate: function(timestamp: any) {
			if (this.startedAt == null) {
				this.startedAt = timestamp;
			}

			const timeDiff = timestamp - this.startedAt;

			this.opts.forEach((opt: any) => {
				if (opt.isFinished) {
					return;
				}
					
				const timeRemaining = Math.max(opt.duration - timeDiff, 0);
				const power = 3;
				const offset = ( Math.pow(timeRemaining, power) / Math.pow(opt.duration, power) ) * opt.startOffset;
				
				// negative, such that slots move from top to bottom
				const pos = -1 * Math.floor((offset + opt.finalPos) % opt.height);

				console.log(opt.startOffset);
				if (opt.startOffset === 0) {
					const offset2 = ( Math.pow(timeRemaining, power) / Math.pow(opt.duration, power) ) * opt.finalPos;
					const newPos = -1 * Math.floor((opt.height - offset2) % opt.height);
					console.log(newPos, offset2);
					opt.el.style.transform = "translateY(" + newPos + "px)";
				} else {
					opt.el.style.transform = "translateY(" + pos + "px)";
				}
				// if (opt.startOffset < opt.finalPos) {
					
				// } else {
					
				// }

				// opt.el.style.transform = "translateY(" + pos + "px)";
				
				if ( timeDiff > opt.duration ) {
					console.log('finished', opt, pos, opt.finalPost)
					opt.isFinished = true
				}
			});

			if (this.opts.every((o: any) => o.isFinished)) {
				this.opts = null
				this.startedAt = null
				console.log('finished')
			} else {
				next( this.animate )
			}
		}
  }
});
</script>

<template>
	<div class='slot-machine'>
		<button @click='start'>start</button>
		<div class='slot' v-for="slot in slots" ref='slotRefs'>
			<h2>{{ slot.title }}</h2> 
			<div class='slot__window'>
				<div class='slot__wrap'>
					<!-- <div class='slot__item' v-for='opt in slot.items'>{{ opt }}</div> -->
					<template v-for="mount in slot.items">
						<img :src="mount.Icon" :alt="mount.Name" :title="mount.Name" class="slot__item">
					</template>
					<img :src="slot.items[0].Icon" :alt="slot.items[0].Name" :title="slot.items[0].Name" class="slot__item slot__item--copy">
					<!-- <div class='slot__item slot__item--copy' >{{ slot.items[0] }}</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.slot {
  float: left;
  margin: 0.4em;
}

.slot__window {
  background-color: green;
  width: 220px;
  height: 232px;
  overflow: hidden;
}

.slot__wrap {

}

.slot__item {
  margin-top: 20px;
  height: 192px;
  width: 192px;
  padding: 0 10px;

  text-align: center;
  background-color: blue;
  color: white;
  
  line-height: 160px;
}

.slot__item--copy {
}
</style>