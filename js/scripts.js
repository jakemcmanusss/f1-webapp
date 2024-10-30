// scripts.js

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://f1-web-app-b8de4dc7fd4b.herokuapp.com';

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

async function displayNextRace() {
  const data = await fetchData('api/current/next.json');
  if (data.error) {
    document.getElementById('next-race').textContent = `Error: ${data.error}`;
  } else {
    // Process and display next race information
  }
}

async function displayLastRace() {
  const data = await fetchData('api/current/last/results.json');
  if (data.error) {
    document.getElementById('last-race').textContent = `Error: ${data.error}`;
  } else {
    // Process and display last race results
  }
}

async function displayDriverStandings() {
  const data = await fetchData('api/current/driverStandings.json');
  if (data.error) {
    document.getElementById('driver-standings').textContent = `Error: ${data.error}`;
  } else {
    // Process and display driver standings
  }
}

async function displayConstructorStandings() {
  const data = await fetchData('api/current/constructorStandings.json');
  if (data.error) {
    document.getElementById('constructor-standings').textContent = `Error: ${data.error}`;
  } else {
    // Process and display constructor standings
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayNextRace();
  displayLastRace();
  displayDriverStandings();
  displayConstructorStandings();
});