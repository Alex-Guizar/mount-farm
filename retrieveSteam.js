const fs = require('fs');
const axios = require('axios');

const userList = [
	{
		name: "Cheechdafif",
		steamid: "76561198014887474"
	},
];

async function retrieveSteamData() {
	const APIKey = "5E9E8148F5A902C03611E8D2466C11C5";
	// const friendsUrl = "https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?relationship=friend";
	const ownedGameUrl = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?include_appinfo=true";

	const requests = userList.map((user) => 
		axios.get(`${ownedGameUrl}&key=${APIKey}&steamid=${user.steamid}`)
	);

	const fullRequestData = await axios.all(requests).then((response) => {
		const steamData = response.map((resp) => {
			let msg = {
				server: resp.headers.server,
				status: resp.status,
				fields: Object.keys(resp.data).toString(),
			};
			//console.info(resp.config.url);
			//console.table(msg);
			return resp.data.response;
		});

		return steamData;
	});

	const fullUserList = userList.map((user, i) => {
		const updatedUser = user;
		updatedUser.game_count = fullRequestData[i].game_count;
		updatedUser.games = fullRequestData[i].games;

		return updatedUser;
	})

	console.log('API Calls Finished!');
	return fullUserList;
}

function updateSteamData() {
  const steamData = retrieveSteamData();
  steamData.then(res => {
		const jsonContent = JSON.stringify(res);

		fs.writeFile('./src/json/TrackedSteam.json', jsonContent, err => {
			if (err) {
				console.error(err);
			}

			console.log("Steam Saved!");
		});
	})
	.catch(err => {
		console.error(err);
	});
}

updateSteamData();