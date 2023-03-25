const fs = require('fs');
const axios = require('axios');

const mountNames = [
	// A Realm Reborn
	{ exp: "ARR", name: "aithon", from: "trial" },
	{ exp: "ARR", name: "xanthos", from: "trial" },
	{ exp: "ARR", name: "gullfaxi", from: "trial" },
	{ exp: "ARR", name: "enbarr", from: "trial" },
	{ exp: "ARR", name: "markab", from: "trial" },
	{ exp: "ARR", name: "boreas", from: "trial" },
	// Heavensward
	{ exp: "HW", name: "lanner", from: "trial" },
	{ exp: "HW", name: "gobwalker", from: "raid" },
	{ exp: "HW", name: "arrhidaeus", from: "raid" },
	// Stormblood
	{ exp: "STB", name: "kamuy", from: "trial" },
	{ exp: "STB", name: "alte roite", from: "raid" },
	{ exp: "STB", name: "air force", from: "raid" },
	{ exp: "STB", name: "model o", from: "raid" },
	// Shadowbringers
	{ exp: "SHB", name: "gwiber", from: "trial" },
	{ exp: "SHB", name: "skyslipper", from: "raid" },
	{ exp: "SHB", name: "ramuh", from: "raid" },
	{ exp: "SHB", name: "eden", from: "raid" },
	// Endwalker
	{ exp: "EW", name: "lynx", from: "trial" },
	{ exp: "EW", name: "demi-phoinix", from: "raid" },
	{ exp: "EW", name: "sunforged", from: "raid" },
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