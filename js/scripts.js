// Set the base URL to the Heroku server or the proxy server
const baseURL = 'https://f1-web-app-b8de4dc7fd4b.herokuapp.com/'; // Update to your Heroku app URL

async function fetchData(endpoint) {
  const fullURL = `${baseURL}/${endpoint}`;
  try {
    const response = await fetch(fullURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    return { error: error.message };
  }
}

function updateUI(data, elementId) {
  const element = document.getElementById(elementId);
  if (data.error) {
    element.textContent = `Error: ${data.error}`;
  } else {
    // Update UI based on the fetched data
    if (elementId === 'next-race') {
      // Assuming the API response structure
      const race = data.MRData.RaceTable.Races[0];
      element.textContent = `Next Race: ${race.raceName} on ${new Date(race.date).toLocaleDateString()}`;
    } else if (elementId === 'last-race') {
      // Example for last race results
      const lastRace = data.MRData.RaceTable.Races[0];
      element.textContent = `Last Race: ${lastRace ? lastRace.raceName : 'Error fetching data'}`;
    } else if (elementId === 'driver-standings') {
      // Display driver standings
      const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      element.innerHTML = standings.map(d => `${d.position} - ${d.Driver.givenName} ${d.Driver.familyName}`).join('<br>');
    } else if (elementId === 'constructor-standings') {
      // Display constructor standings
      const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      element.innerHTML = standings.map(c => `${c.position} - ${c.Constructor.name}`).join('<br>');
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const nextRaceData = await fetchData('api/current/next.json');
    updateUI(nextRaceData, 'next-race');

    const lastRaceData = await fetchData('api/current/last/results.json');
    updateUI(lastRaceData, 'last-race');

    const driverStandingsData = await fetchData('api/current/driverStandings.json');
    updateUI(driverStandingsData, 'driver-standings');

    const constructorStandingsData = await fetchData('api/current/constructorStandings.json');
    updateUI(constructorStandingsData, 'constructor-standings');
  } catch (error) {
    console.error('Error:', error);
  }
});
