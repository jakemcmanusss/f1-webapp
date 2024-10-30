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
  if (!element) {
    console.warn(`Element with id '${elementId}' not found.`);
    return; // Exit if the element is not found
  }
  
  if (data.error) {
    element.textContent = `Error: ${data.error}`;
  } else {
    // Example of updating UI with fetched data
    if (elementId === 'next-race') {
      const race = data.MRData.RaceTable.Races[0];
      if (race) {
        element.textContent = `Next Race: ${race.raceName} on ${race.date}`;
      } else {
        element.textContent = 'No upcoming race found.';
      }
    } else if (elementId === 'last-race') {
      const race = data.MRData.RaceTable.Races[0];
      element.textContent = race ? 'Last Race: ' + race.raceName : 'Error fetching data';
    } else if (elementId === 'driver-standings') {
      const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings;
      element.textContent = standings ? standings.map(d => `${d.position} - ${d.Driver.givenName} ${d.Driver.familyName}`).join(', ') : 'Error fetching driver standings.';
    } else if (elementId === 'constructor-standings') {
      const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings;
      element.textContent = standings ? standings.map(c => `${c.position} - ${c.Constructor.name}`).join(', ') : 'Error fetching constructor standings.';
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
