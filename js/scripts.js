// scripts.js

// Assuming your server is handling proxy requests for you
const baseURL = window.location.origin;

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
    // Example of updating UI with fetched data
    if (elementId === 'next-race') {
      // Assuming the API response structure
      const race = data.MRData.RaceTable.Races[0];
      element.textContent = `Next Race: ${race.raceName} on ${race.date}`;
    } else if (elementId === 'last-race') {
      // Example for last race results
      element.textContent = 'Last Race: ' + (data.MRData.RaceTable.Races[0] ? data.MRData.RaceTable.Races[0].raceName : 'Error fetching data');
    } else if (elementId === 'driver-standings') {
      // Display driver standings
      const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      element.textContent = standings.map(d => `${d.position} - ${d.Driver.givenName} ${d.Driver.familyName}`).join(', ');
    } else if (elementId === 'constructor-standings') {
      // Display constructor standings
      const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      element.textContent = standings.map(c => `${c.position} - ${c.Constructor.name}`).join(', ');
    }
}}

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