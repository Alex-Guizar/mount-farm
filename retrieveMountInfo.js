const fs = require('fs');
const axios = require('axios');

const mountNames = [
	// A Realm Reborn
	{ exp: "ARR", name: "aithon", from: "trial", instance: "the bowl of embers" },
	{ exp: "ARR", name: "xanthos", from: "trial", instance: "the howling eye" },
	{ exp: "ARR", name: "gullfaxi", from: "trial", instance: "the navel" },
	{ exp: "ARR", name: "enbarr", from: "trial", instance: "the whorleater" },
	{ exp: "ARR", name: "markab", from: "trial", instance: "the striking tree" },
	{ exp: "ARR", name: "boreas", from: "trial", instance: "the akh afah amphitheatre" },
	// Heavensward
	{ exp: "HW", name: "white lanner", from: "trial", instance: "the limitless blue" },
	{ exp: "HW", name: "rose lanner", from: "trial", instance: "thok ast thok" },
	{ exp: "HW", name: "round lanner", from: "trial", instance: "the minstrel's ballad: thordan's reign" },
	{ exp: "HW", name: "warring lanner", from: "trial", instance: "containment bay S1T7" },
	{ exp: "HW", name: "dark lanner", from: "trial", instance: "the minstrel's ballad: nidhogg's rage" },
	{ exp: "HW", name: "sophic lanner", from: "trial", instance: "containment bay P1T6" },
	{ exp: "HW", name: "demonic lanner", from: "trial", instance: "containment bay Z1T9" },
	{ exp: "HW", name: "gobwalker", from: "raid", instance: "alexander - the burden of the father" },
	{ exp: "HW", name: "arrhidaeus", from: "raid", instance: "alexander - the soul of the creator" },
	// Stormblood
	{ exp: "STB", name: "blissful kamuy", from: "trial", instance: "emanation" },
	{ exp: "STB", name: "reveling kamuy", from: "trial", instance: "the pool of tribute" },
	{ exp: "STB", name: "legendary kamuy", from: "trial", instance: "the minstrel's ballad: shinryu's domain" },
	{ exp: "STB", name: "auspicious kamuy", from: "trial", instance: "the jade stoa" },
	{ exp: "STB", name: "lunar kamuy", from: "trial", instance: "the minstrel's ballad: tsukuyomi's pain" },
	{ exp: "STB", name: "euphonious kamuy", from: "trial", instance: "hells' kier" },
	{ exp: "STB", name: "hallowed kamuy", from: "trial", instance: "the wreath of snakes" },
	{ exp: "STB", name: "alte roite", from: "raid", instance: "deltascape V4.0" },
	{ exp: "STB", name: "air force", from: "raid", instance: "sigmascape V4.0" },
	{ exp: "STB", name: "model o", from: "raid", instance: "alphascape V4.0" },
	// Shadowbringers
	{ exp: "SHB", name: "fae gwiber", from: "trial", instance: "the dancing plague" },
	{ exp: "SHB", name: "innocent gwiber", from: "trial", instance: "the crown of the immaculate" },
	{ exp: "SHB", name: "shadow gwiber", from: "trial", instance: "the minstrel's ballad: hades's elegy" },
	{ exp: "SHB", name: "ruby gwiber", from: "trial", instance: "cinder drift" },
	{ exp: "SHB", name: "gwiber of light", from: "trial", instance: "the seat of sacrifice" },
	{ exp: "SHB", name: "emerald gwiber", from: "trial", instance: "castrum marinum" },
	{ exp: "SHB", name: "diamond gwiber", from: "trial", instance: "the cloud deck" },
	{ exp: "SHB", name: "skyslipper", from: "raid", instance: "eden's gate: sepulture" },
	{ exp: "SHB", name: "ramuh", from: "raid", instance: "eden's verse: refulgence" },
	{ exp: "SHB", name: "eden", from: "raid", instance: "eden's promise: eternity" },
	// Endwalker
	{ exp: "EW", name: "lynx of eternal darkness", from: "trial", instance: "the minstrel's ballad: zodiark's fall" },
	{ exp: "EW", name: "lynx of divine light", from: "trial", instance: "the minstrel's ballad: hydaelyn's call" },
	{ exp: "EW", name: "bluefeather lynx", from: "trial", instance: "the minstrel's ballad: endsinger's aria" },
	{ exp: "EW", name: "lynx of imperious wind", from: "trial", instance: "storm's crown" },
	{ exp: "EW", name: "lynx of righteous fire", from: "trial", instance: "mount ordeals" },
	{ exp: "EW", name: "lynx of fallen shadow", from: "trial", instance: "the voidcast dais" },
	{ exp: "EW", name: "demi-phoinix", from: "raid", instance: "asphodelos: the fourth circle" },
	{ exp: "EW", name: "sunforged", from: "raid", instance: "abyssos: the eighth circle" },
	{ exp: "EW", name: "megaloambystoma", from: "raid", instance: "anabaseios: the twelfth circle" },
];

const blackList = [
	"wondrous lanner",
	"kamuy of the nine tails",
];

function buildData(mountData) {
	const modifiedData = mountData.map((mount) => {
		const expansion = mountNames.find((mName) => mount.Name.toLowerCase().includes(mName.name.toLowerCase()));
		mount.Icon = `https://xivapi.com${mount.Icon}`;
		if (expansion) {
			mount.Expansion = expansion.exp;
			mount.From = expansion.from;
			mount.Instance = expansion.instance;
		}
		return mount;
	});
	
	return modifiedData;
}

async function retrieveMountData() {
	let matchArray = [];
	mountNames.forEach((mount) => {
		const shouldObj = {
			"wildcard": {
				"NameCombined_en": "*"+ mount.name +"*"
			}
		};

		matchArray.push(shouldObj);
	});

	const mountParams = {
		"indexes": "mount",
  	"columns": "Name,ID,Icon",
		"body": {
			"query": {
				"bool": {
					"minimum_should_match": 1,
					"should": matchArray
				}
			},
			"from": 0,
			"size": 50
		},
	}

  const response = await axios.post('https://xivapi.com/search', mountParams);

  if (!response.statusText) {
		const message = `An error has occured: ${response.status}`;

		throw new Error(message);
	}

	const mountData = await response.data.Results;
	console.log('API Calls Finished!');
	return mountData;
}

function sortMounts(a, b) {
	if ((a.From === "trial" && b.From === "raid") && a.Expansion === b.Expansion) {
		return -1;
	}
	if ((a.From === "raid" && b.From === "trial") && a.Expansion === b.Expansion) {
		return 1;
	}
	return 0;
}

function updateMounts() {
  const mountData = retrieveMountData();
  mountData.then(res => {
		const filteredArr = res.filter((mount) => !blackList.includes(mount.Name.toLowerCase()));
		const finishedData = buildData(filteredArr);
		finishedData.sort(sortMounts);
    const jsonContent = JSON.stringify(finishedData);
		
		fs.writeFile('./src/json/TrackedMounts.json', jsonContent, err => {
			if (err) {
				console.error(err);
			}

			console.log("Mounts Saved!");
		});
  })
  .catch(err => {
    console.log(err);
  });
}

updateMounts();