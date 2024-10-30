const localProxy = 'https://ergast.com/api/f1/';

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Find the "Simulate Results" button by its ID
    const simulateButton = document.getElementById('simulate-results-btn');
    
    // Check if the button exists on the page
    if (simulateButton) {
        // Add a click event listener to navigate to the /simulate route
        simulateButton.addEventListener('click', () => {
            window.location.href = 'http://127.0.0.1:3000/simulate';
        });
    } else {
        // Output an error if the button is not found
        console.error('Button with ID simulate-results-btn not found');
    }

    // Function to handle errors by displaying a message in the appropriate section
    function handleError(section, message) {
        const sectionElement = document.querySelector(section + ' tbody');
        if (sectionElement) {
            sectionElement.innerHTML = `<tr><td colspan="100%">${message}</td></tr>`;
        }
    }

    // Function to fetch driver standings (top 10)
    async function fetchDriverStandings() {
        try {
            const response = await fetch('/api/current/driverStandings.json');
            if (!response.ok) throw new Error('Failed to fetch driver standings');
            const data = await response.json();
            const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

            let driverTable = '';
            standings.slice(0, 10).forEach((driver, index) => {
                driverTable += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
                        <td>${driver.Constructors[0].name}</td>
                        <td>${driver.points}</td>
                    </tr>`;
            });
            document.querySelector('.driver-standings tbody').innerHTML = driverTable;

        } catch (error) {
            console.error('Error fetching driver standings:', error);
            handleError('.driver-standings', 'Error loading driver standings.');
        }
    }

    // Function to fetch constructor standings
    async function fetchConstructorStandings() {
        try {
            const response = await fetch('/api/current/constructorStandings.json');
            if (!response.ok) throw new Error('Failed to fetch constructor standings');
            const data = await response.json();
            const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

            let constructorTable = '';
            standings.forEach((constructor, index) => {
                constructorTable += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${constructor.Constructor.name}</td>
                        <td>${constructor.points}</td>
                        <td>${constructor.wins}</td>
                    </tr>`;
            });
            document.querySelector('.standings tbody').innerHTML = constructorTable;
        } catch (error) {
            console.error('Error fetching constructor standings:', error);
            handleError('.standings', 'Error loading constructor standings.');
        }
    }

    // Function to fetch last race results (top 10)
    async function fetchLastRaceResults() {
        try {
            const response = await fetch('/api/current/last/results.json');
            if (!response.ok) throw new Error('Failed to fetch last race results');
            
            const data = await response.json();
            const lastRace = data.MRData.RaceTable.Races[0];
            const results = lastRace.Results;

            document.querySelector('.last-race h2').textContent = `Last Race: ${lastRace.raceName}`;
            document.querySelector('.last-race p').textContent = `${lastRace.Circuit.circuitName} | ${lastRace.date}`;

            let raceResultsTable = '';
            results.slice(0, 10).forEach((result, index) => {
                raceResultsTable += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${result.Driver.givenName} ${result.Driver.familyName}</td>
                        <td>${result.Constructor.name}</td>
                        <td>${result.laps}</td>
                        <td>${result.Time ? result.Time.time : 'N/A'}</td>
                        <td>${result.points}</td>
                    </tr>`;
            });
            document.querySelector('.last-race tbody').innerHTML = raceResultsTable;

        } catch (error) {
            console.error('Error fetching last race results:', error);
            handleError('.last-race', 'Error loading last race results.');
        }
    }

    // Function to fetch next race information and start countdown
    async function fetchNextRace() {
        try {
            const response = await fetch('/api/current.json');
            if (!response.ok) throw new Error('Failed to fetch next race information');

            const data = await response.json();
            const races = data.MRData.RaceTable.Races;
            const nextRace = races.find(race => new Date(race.date) > new Date());

            document.querySelector('.next-race h2').textContent = `Next Race: ${nextRace.raceName}`;
            document.querySelector('.next-race p').textContent = `${nextRace.Circuit.circuitName} | ${nextRace.date}`;

            // Start countdown if next race is available
            if (nextRace) startCountdown(nextRace.date, nextRace.time);
        } catch (error) {
            console.error('Error fetching next race information:', error);
            document.querySelector('.next-race h2').textContent = 'Error loading next race.';
        }
    }

    // Countdown Timer for the next race
    function startCountdown(raceDate, raceTime) {
        const raceDateTime = new Date(`${raceDate}T${raceTime}`);
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = raceDateTime - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                document.querySelector('.countdown').innerHTML = "Race has started!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerHTML = days;
            document.getElementById("hours").innerHTML = hours;
            document.getElementById("minutes").innerHTML = minutes;
            document.getElementById("seconds").innerHTML = seconds;
        }, 1000);
    }

    // Initialization function to load all necessary data on page load
    async function init() {
        await fetchNextRace();
        await fetchLastRaceResults();
        await fetchDriverStandings();
        await fetchConstructorStandings();
    }

    // Call init when the DOM is fully loaded
    init();
});