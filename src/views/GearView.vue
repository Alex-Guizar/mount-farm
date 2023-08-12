<script lang="ts">
import { defineComponent, ref } from 'vue';
import LogoSVG from '@/assets/UwULogo.vue';
import Dropdown from '@/components/Dropdown.vue';
import Checkbox from '@/components/Checkbox.vue';

interface Listing {
	pricePerUnit?: number;
	worldName?: string;
}

interface Gear {
  Name: string;
  ID: number;
  ItemUICategory: object;
	listings: Listing[];
	Icon: string;
	IconHD: string;
};

export default defineComponent({
  components: {
    LogoSVG,
		Dropdown,
		Checkbox,
  },
  data() {
    return {
			ffxivUrl: "https://xivapi.com/search",
			selectedMember: false,
			iLvl: 1,
			gearData: [] as Gear[],
			fullGearListings: [] as Gear[],
			trackedGear: [] as Gear[],
    };
  },
  mounted() {
		
  },
  beforeUpdate() {
    
  },
  methods: {
		normalizeText(text: string) {
			return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
		},
		updateListings() {
			this.retrieveGearData();
		},
		retrieveGearData() {
			const mustArr = [
				{
					"match": {
						"ItemKind.Name_en": "Arms"
					}
				},
				{
					"match": {
						"IsUntradable": 0
					}
				}
			];

			const filterArr = [
          {
            "range": {
              "LevelItem": {
                "gt": this.iLvl
              }
            }
          }
        ]

			const gearParams = {
				"indexes": "item",
				"columns": "Name,ItemKind.Name_en,ID,Icon,IconHD",
				"body": {
					"query": {
						"bool": {
							"must": mustArr,
							"filter": filterArr
						}
					},
					"from": 0,
					"size": 500
				},
			}

			fetch(this.ffxivUrl, {
				method: "POST",
				body: JSON.stringify(gearParams)
			})
			.then((res: any) => {
				return res.json();
			})
			.then((data) => {
				const gearData = data.Results;
				this.gearData = gearData;
				this.retrieveGearListingData();
			})
			.catch((err) => {
				console.log(err);
			});
		},
		retrieveGearListingData() {
			const totalItems: number[] = [];
			this.gearData.forEach((gear) => {
				totalItems.push(gear.ID);
			});

			const maxItems = 100;
			const region = "Crystal"; // alternative 'North-America'
			const listings = "listings=5";
			const fields = "fields=items.listings.pricePerUnit%2Citems.listings.worldName";
			const pages = Math.ceil(totalItems.length / maxItems);
			const passedItems = [];
			for (let i = 0; i < pages; i++) {
				passedItems.push(totalItems.slice(i*100, ((i+1)*100)).join(","));
			}
			const retrieveURLs: string[] = [];
			passedItems.forEach((list) => {
				retrieveURLs.push(`https://universalis.app/api/v2/${region}/${list}?${listings}&${fields}`)
			});
			const requests = retrieveURLs.map((url) => fetch(url).then(resp => resp.json()));

			Promise.all(requests).then((resp: any) => {
				const gearWListings: Gear[] = this.attachListings(resp);

				const sortedGear = this.sort(gearWListings);
				this.fullGearListings = sortedGear;
				// this.fullGearListings = gearWListings;
			});
		},
		attachListings(listingsData: any) {
			const gearWListings = this.gearData.map((gear: any) => {
				listingsData.forEach((listing: any) => {
					if (listing.items[gear.ID]) {
						gear.listings = listing.items[gear.ID]?.listings;
					}
				});

				return gear;
			});

			return gearWListings;
		},
		sort(arr: Gear[]) {
			const sortedArr = arr.sort((a: any, b: any) => {
				if (a.listings !== undefined && b.listings !== undefined) {
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
  }
});
</script>

<template>
  <main class="pb-20">
		<div class="mt-8 flex">
			<div>
				<input type="text" v-model="iLvl" name="iLvl" />
			</div>

			<div class="ml-10">
				<button 
					@click="updateListings"
					class="border border-slate-100 rounded py-1 px-3 flex items-center"
				>Update Listings</button>
			</div>
		</div>
		<div class="mt-8 flex w-full">
			<div>
				<table>
					<tr
						v-for="(gear, index) in fullGearListings"
						:key="gear.ID"
						:class="{ 'bg-zinc-800': index % 2 }"
					>
						<td class="w-[8rem] py-4 text-center">
							<img :src="`https://xivapi.com${gear.IconHD}`" :alt="gear.Name" :title="gear.Name" class="w-20 mx-auto">
							{{ gear.Name }}
						</td>
						<td
							class="text-center px-4 py-2 border-l border-r border-zinc-600 cursor-pointer"
							v-for="listing in gear.listings"
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
