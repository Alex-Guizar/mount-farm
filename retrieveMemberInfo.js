//const schedule = require('node-schedule');
const fs = require('fs');
const axios = require('axios');
const honoraryMembers = [
  "Seiken Kyu",
  "Brockodile Dundee",
  "Brockness Monster",
  "Silk Redarse"
]

async function retrieveHonoraryData(charName) {
  const response = await axios.get('https://xivapi.com/character/search?name=' + charName + '&server=Zalera');

  if (!response.statusText) {
		const message = `An error has occured: ${response.status}`;

		throw new Error(message);
	}

	const honorData = await response.data.Results[0];
	return honorData;
}

async function retrieveFcData() {
  const response = await axios.get('https://xivapi.com/freecompany/9229142273877455434?data=FCM');

  if (!response.statusText) {
		const message = `An error has occured: ${response.status}`;

		throw new Error(message);
	}

	const fcData = await response.data;
	return fcData;
}

async function retrieveCharData(charID) {
  const response = await axios.get('https://xivapi.com/character/' + charID + '?data=MIMO');

  if (!response.statusText) {
		const message = `An error has occured: ${response.status}`;

		throw new Error(message);
	}

	const charData = await response.data;
	return charData;
}

function updateMembers() {
  const fcMembers = [];
  const fcData = retrieveFcData();
  fcData.then(async res => {
    res.FreeCompanyMembers.forEach((member) => {
      const fcMember = {};
      fcMember.name = member.Name;
      fcMember.ID = member.ID;
      fcMembers.push(fcMember);
    });

    await Promise.all(honoraryMembers.map(async (member) => {
      const honoraryData = await retrieveHonoraryData(member);
      const honoraryMember = {};
      honoraryMember.name = honoraryData.Name;
      honoraryMember.ID = honoraryData.ID;
      fcMembers.push(honoraryMember);
    }));

    const finished = new Promise((resolve, reject) => {
      let i = 0;
      setTimeout(function run() {
        const memberData = retrieveCharData(fcMembers[i].ID);
        memberData.then(res => {
          console.log(res.Character.Name);
          fcMembers[i].Mounts = res.Mounts;
          fcMembers[i].Minions = res.Minions;
          if (i < fcMembers.length - 1) {
            i++;
            setTimeout(run, 1000);
          } else {
            resolve(true);
          }
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
      }, 1000);
    });

    finished.then((res) => {
      console.log('API Calls Finished!');
      const jsonContent = JSON.stringify(fcMembers);
      fs.writeFile('./src/json/MemberInfo.json', jsonContent, err => {
        if (err) {
          console.error(err);
        }

        console.log("Users Saved!");
      });
    })
    .catch((err) => {
      console.error(err);
    });
  })
  .catch(err => {
    console.log(err);
  });
}

updateMembers();

// schedule.scheduleJob("* */5 * * * *", function() {
//   updateMembers();
// });