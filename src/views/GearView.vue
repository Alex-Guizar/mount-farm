<template>
  <main class="pb-20 leading-5">
		<div class="flex gap-8 mt-8">
			<div>
				<div>Filter Gear by Desynther</div>
				<div class="flex flex-wrap justify-start gap-2 w-[15.125rem] mt-4">
					<JobRadio v-for="job in jobs" :value="job" v-model="selectedJob"></JobRadio>
				</div>
			</div>

			<div>
				<label class="block" for="gear-ilvl">Minimum iLvl</label>
				<input class="bg-transparent border border-slate-100 rounded p-2 mt-4 text-base" type="text" v-model="iLvl" name="iLvl" id="gear-ilvl" />
			</div>

			<div class="mt-9">
				<button
					@click="updateListings"
					class="border border-slate-100 rounded-full py-2 px-3 text-base"
				>Update Listings</button>
			</div>
		</div>
		<div class="p-4" v-if="isLoading">Loading...</div>
		<div class="p-4" v-if="errorMsg">{{ errorMsg }}</div>
		<div class="mt-8 flex w-full">
			<div>
				<table class="gear-table">
					<tr
						v-for="(gear, index) in fullGearListings"
						:key="gear.ID"
						:class="{
							'bg-zinc-800': index % 2
						}"
					>
						<td class="w-[12rem] px-4 py-4 text-center">
							<img :src="`https://xivapi.com${gear.IconHD}`" :alt="gear.Name" :title="gear.Name" class="w-20 mx-auto">
							<div class="mt-4">{{ gear.Name }}</div>
							<div>iLvl: {{ gear.LevelItem }}</div>
						</td>
						<td
							class="text-center w-[11rem] px-8 py-2 border-l border-r border-zinc-600 cursor-pointer"
							v-if="gear.listings && gear.listings.length"
							v-for="listing in gear.listings"
						>
							{{ listing.pricePerUnit?.toLocaleString("en-US") }} Gil<br />
							{{ listing.worldName }}
						</td>
						<td
							class="text-center w-[11rem] px-4 py-2 border-l border-r border-zinc-600 cursor-pointer"
							v-else
							v-for="index in 5"
						>
							Price<br />
							World
						</td>
					</tr>
				</table>
			</div>
		</div>
  </main>
</template>

<style>
.gear-table tr {
	/** transform: translateX(50%);
	opacity: 0;
	transition: all 1s ease-in-out; **/
}
.gear-table .slide-in {
	transform: translateX(0);
	opacity: 1;
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import JobRadio from '@/components/JobRadio.vue';

interface Listing {
	pricePerUnit?: number;
	worldName?: string;
}

interface Repairer {
	Abbreviation_en: string;
	Icon: string;
	Name_en: string;
}

interface Gear {
	ClassJobRepair: Repairer;
	Desynth: number;
  ID: number;
	Icon: string;
	IconHD: string;
	ItemKind: {
		Name_en: string;
	}
	LevelItem: number;
	listings: Listing[];
	Name: string;
};

export default defineComponent({
  components: {
		JobRadio,
  },
  data() {
    return {
			ffxivUrl: "https://xivapi.com/search",
			selectedMember: false,
			iLvl: 1,
			gearData: [] as Gear[],
			fullGearListings: [] as Gear[],
			trackedGear: [] as Gear[],
			selectedJob: "",
			isLoading: false,
			errorMsg: "",
			testing: {
				test: "Name"
			} as Listing,
			jobs: [
				"CRS",
				"ALC",
				"ARM",
				"BSM",
				"CRP",
				"CUL",
				"GSM",
				"LTW",
				"WVR",
			]
    };
  },
  mounted() {
		
  },
  beforeUpdate() {
		console.log("beforeUpdate");
  },
	updated() {
		console.log("onUpdated");
		const tableRows = document.querySelectorAll(".gear-table tr");
		tableRows.forEach((ele, i) => {
			console.log(ele);
			//this.slideIn(ele, i)
		});
	},
  methods: {
		returnTimeout(i: number) {
			return setTimeout(() => {
				return true;
			}, (i + 5) * 200);
		},
		normalizeText(text: string) {
			return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
		},
		updateListings() {
			this.isLoading = true;
			this.retrieveGearData();
		},
		retrieveGearData() {
			const mustArr = [
				{
					"match": {
						"IsUntradable": 0
					}
				},
			];
			
			const mustNotArr = [
				{
					"match": {
						"Desynth": 0
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
				},
				...(this.selectedJob !== "" && this.selectedJob !== "CRS" ? [
					{
						"match": {
							"ClassJobRepair.Abbreviation_en": this.selectedJob
						}
					}
				] : [])
			];

			const shouldArr = [
				{
					"match": {
						"ItemKind.Name_en": "Arms"
					}
				},
				{
					"match": {
						"ItemKind.Name_en": "Armor"
					}
				},
				{
					"match": {
						"ItemKind.Name_en": "Tools"
					}
				},
			]

			const gearParams = {
				"indexes": "item",
				"columns": "Name,ItemKind.Name_en,ID,Icon,IconHD,Desynth,ClassJobRepair.Abbreviation_en,ClassJobRepair.Name_en,ClassJobRepair.Icon,LevelItem",
				"body": {
					"query": {
						"bool": {
							"must": mustArr,
							"must_not": mustNotArr,
							"should": shouldArr,
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
				this.fullGearListings = gearData;
				this.retrieveGearListingData();
			})
			.catch((err) => {
				console.log(err);
				this.isLoading = false;
				this.errorMsg = "Sorry, looks like item retrieval failed."
			});
		},
		retrieveGearListingData() {
			const totalItems: number[] = [];
			this.gearData.forEach((gear) => {
				totalItems.push(gear.ID);
			});

			const maxItems = 99;
			const region = "Crystal"; // alternative 'North-America'
			const listings = "listings=5";
			const fields = "fields=items.listings.pricePerUnit%2Citems.listings.worldName";
			const pages = Math.ceil(totalItems.length / maxItems);
			const passedItems = [];
			for (let i = 0; i < pages; i++) {
				passedItems.push(totalItems.slice(i*99, ((i+1)*99)).join(","));
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
				this.isLoading = false;
			}).catch(() => {
				this.isLoading = false;
				this.errorMsg = "Sorry, looks like price retrieval failed."
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
				if (a.listings?.length && b.listings?.length) {
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
		slideIn(row: any, index: number) {
			setTimeout(() => {
				row.classList.add("slide-in");
			}, (index + 5) * 100);
		}
  }
});
</script>
