const fs = require('fs');
const axios = require('axios');

const blackList = [
	
];

async function retrieveMinionData() {
	const mustArr = [
		{
			"match": {
				"ItemUICategory.Name_en": "minion"
			}
		},
		{
			"match": {
				"IsUntradable": 0
			}
		}
	];

	const minionParams = {
		"indexes": "item",
  	"columns": "Name,ItemUICategory.Name_en,ID,Icon,IconHD",
		"body": {
			"query": {
				"bool": {
					"must": mustArr
				}
			},
			"from": 0,
			"size": 500
		},
	}

  const response = await axios.post('https://xivapi.com/search', minionParams);

  if (!response.statusText) {
		const message = `An error has occured: ${response.status}`;

		throw new Error(message);
	}

	const minionData = await response.data.Results;
	const minionsWPrice = minionData.map((minion) => ({...minion, listings: []}));
	console.log('API Calls Finished!');
	return minionsWPrice;
}

function updateMinions() {
  const minionData = retrieveMinionData();
  minionData.then(res => {
		const filteredArr = res.filter((minion) => !blackList.includes(minion.Name.toLowerCase()));
		const finishedData = filteredArr;
    const jsonContent = JSON.stringify(finishedData);
		
		fs.writeFile('./src/json/TrackedMinions.json', jsonContent, err => {
			if (err) {
				console.error(err);
			}

			console.log("Minions Saved!");
		});
  })
  .catch(err => {
    console.log(err);
  });
}

updateMinions();