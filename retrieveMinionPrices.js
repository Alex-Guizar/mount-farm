const trackedMinions = require('./src/json/TrackedMinions.json');

const fs = require('fs');
const axios = require('axios');

const blackList = [
	
];

async function retrieveListingsData() {
	const totalItems = [];
	trackedMinions.forEach((minion) => {
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
	const retrieveURLs = [];
	passedItems.forEach((list) => {
		retrieveURLs.push(`https://universalis.app/api/v2/${region}/${list}?${listings}&${fields}`)
	});
	const requests = retrieveURLs.map((url) => axios.get(url));

  const fullRequestData = await axios.all(requests).then((response) => {
		const listingsData = response.map((resp) => {
			let msg = {
				server: resp.headers.server,
				status: resp.status,
				fields: Object.keys(resp.data).toString(),
			};
			//console.info(resp.config.url);
			//console.table(msg);
			return resp.data.items;
		});

		return listingsData
	});

	console.log('API Calls Finished!');
	return fullRequestData;
}

function attachListings(listingsData) {
	const minonsWListings = trackedMinions.map((minion) => {
		listingsData.forEach((listing) => {
			if (listing[minion.ID]) {
				minion.listings = listing[minion.ID].listings;
			}
		});

		return minion;
	});

	return minonsWListings;
}

function updateMinions() {
  const listingsData = retrieveListingsData();
	listingsData.then(res => {
		const updatedMinions = attachListings(res);
		const jsonContent = JSON.stringify(updatedMinions);

		fs.writeFile('./src/json/TrackedMinions.json', jsonContent, err => {
			if (err) {
				console.error(err);
			}

			console.log("Minions Saved!");
		});
	})
	.catch(err => {
		console.error(err);
	});
}

updateMinions();