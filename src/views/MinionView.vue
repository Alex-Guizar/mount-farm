<script lang="ts">
import { defineComponent, ref } from 'vue';
import LogoSVG from '@/assets/UwULogo.vue';
import MemberInfo from '@/json/MemberInfo.json';
import TrackedMinions from '@/json/TrackedMinions.json';
import Dropdown from '@/components/Dropdown.vue';
import Checkbox from '@/components/Checkbox.vue';

interface Member {
  name: string;
  ID: number;
  Mounts: {
    Icon: string,
    Name: string
  }[];
	Minions: [];
};

interface Listing {
	pricePerUnit?: number;
	worldName?: string;
}

interface Minion {
  Name: string;
  ID: number;
  ItemUICategory?: object;
	listings?: Listing[];
	Icon: string;
	IconHD: string;
};

interface MemberArr extends Array<Member>{};
interface MinionArr extends Array<Minion>{};

export default defineComponent({
  components: {
    LogoSVG,
		Dropdown,
		Checkbox,
  },
  data() {
    return {
			selectedMember: null as Member | null,
      trackedMinions: TrackedMinions as MinionArr,
			memberInfo: MemberInfo as MemberArr,
			missingMinions: [] as MinionArr,
    };
  },
  mounted() {
		const sortedMinions = this.sort(this.trackedMinions);
		this.missingMinions = sortedMinions;
  },
  beforeUpdate() {
    if (this.selectedMember) {
			const member = this.memberInfo.find((member) => {
				return member.ID === this.selectedMember?.ID;
			});
			const memberMinions = member?.Minions;
			const missingMinions = this.trackedMinions.filter((minion: Minion) => 
				!memberMinions?.some((memMinion: any) => 
					this.normalizeText(memMinion.Name).includes(this.normalizeText(minion.Name)) || 
					this.normalizeText(minion.Name).includes(this.normalizeText(memMinion.Name))
				)
			);
			const sortedMinions = this.sort(missingMinions);
			this.missingMinions = sortedMinions;
		}
  },
  methods: {
    sort(arr: Minion[]) {
			const sortedArr = arr.sort((a: any, b: any) => {
				if (a.listings[0] !== undefined && b.listings[0] !== undefined) {
					if (a.listings[0].pricePerUnit < b.listings[0].pricePerUnit) {
						return -1;
					}

					if (a.listings[0].pricePerUnit > b.listings[0].pricePerUnit) {
						return 1;
					}
				}

				return 0;
			});

			return sortedArr;
		},
		normalizeText(text: string) {
			return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
		},
		selectMember(member: Member) {
			this.selectedMember = member;
		},
		updateListings() {
			this.retrieveListingsData();
		},
		retrieveListingsData() {
			const totalItems: number[] = [];
			this.trackedMinions.forEach((minion) => {
				totalItems.push(minion.ID);
			});

			const maxItems = 100;
			const region = "Crystal"; // alternative 'North-America'
			const listings = "listings=5";
			const fields = "fields=items.listings.pricePerUnit%2Citems.listings.worldName";
			const pages = Math.ceil(totalItems.length / maxItems);
			const passedItems = [];
			for (let i = 0; i < pages; i++) {
				passedItems.push(totalItems.slice(i*100, ((i+1)*100)-1).join(","));
			}
			const retrieveURLs: string[] = [];
			passedItems.forEach((list) => {
				retrieveURLs.push(`https://universalis.app/api/v2/${region}/${list}?${listings}&${fields}`)
			});
			const requests = retrieveURLs.map((url) => fetch(url).then(resp => resp.json()));

			Promise.all(requests).then((resp: any) => {
				const minonsWListings = this.attachListings(resp);

				const sortedMinions = this.sort(minonsWListings);
				this.missingMinions = sortedMinions;
			});
		},
		attachListings(listingsData: any) {
			const minonsWListings = this.trackedMinions.map((minion) => {
				listingsData.forEach((listing: any) => {
					if (listing.items[minion.ID]) {
						minion.listings = listing.items[minion.ID]?.listings;
					}
				});

				return minion;
			});

			return minonsWListings;
		},
  }
});
</script>

<template>
  <main class="pb-20 leading-5">
		<div class="mt-8 flex">
			<Dropdown :describer="selectedMember ? selectedMember.name : 'Select Members'">
				<li
					class="border-b border-zinc-600 relative"
					v-for="member in memberInfo"
					:key="member.ID"
				>
					<button
						class="px-4 py-2 block cursor-pointer text-left w-full"
						@click="() => selectMember(member)"
					>{{ member.name }}</button>
				</li>
			</Dropdown>

			<div class="ml-10">
				<button 
					@click="updateListings"
					class="border border-slate-100 rounded-full py-1 px-3 flex items-center"
				>Update Listings</button>
			</div>
		</div>
		<div class="mt-8 flex w-full">
			<div>
				<table>
					<tr
						v-for="(minion, index) in missingMinions"
						:key="minion.ID"
						:class="{ 'bg-zinc-800': index % 2 }"
					>
						<td class="w-[8rem] py-4 text-center">
							<img :src="`https://xivapi.com${minion.IconHD}`" :alt="minion.Name" :title="minion.Name" class="w-20 mx-auto">
							{{ minion.Name }}
						</td>
						<td
							class="text-center px-4 py-2 border-l border-r border-zinc-600 cursor-pointer"
							v-for="listing in minion.listings"
						>
							{{ listing.pricePerUnit?.toLocaleString("en-US") }}<br />
							{{ listing.worldName }}
						</td>
					</tr>
				</table>
			</div>
		</div>
  </main>
</template>
