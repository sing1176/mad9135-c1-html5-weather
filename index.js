import { getForecast, createWeatherIcon } from './weatherService.js';
import { getGeolocation } from './mapService.js';

// Grab Input and pass it to Search
let searchBtn = document
	.getElementById('searchBtn')
	.addEventListener('click', () => {
		let input = document.getElementById('input').value;
		main(input);
	});

async function main(input) {
	const location = input;
	try {
		const coord = await getGeolocation(location);
		const forecast = await getForecast({ coord });
		buildTodayCard(forecast, location);
	} catch (error) {
		console.log(error.message);
	}
}

function buildTodayCard(forecast, location) {
	console.log(forecast);
	let currentTemp = Math.floor(forecast.current.temp);
	let feelsLike = Math.floor(forecast.current.feels_like);
	let todayDate = new Date(forecast.current.dt * 1000);
	forecast.current.dt;
	let humidity = forecast.current.humidity;
	let description = forecast.current.weather[0].description;
	let icon = forecast.current.weather[0].icon;

	const words = description.split(' ');
	for (let i = 0; i < words.length; i++) {
		words[i] = words[i][0].toUpperCase() + words[i].substr(1);
	}
	words.join(' ');

   let capLocation = location.split(' ');
		for (let i = 0; i < capLocation.length; i++) {
			capLocation[i] = capLocation[i][0].toUpperCase() + capLocation[i].substr(1);
		}
		capLocation.join(' ');
   

	let today = document.getElementById('today');
	today.innerHTML = `
   <div class="card">
					<div class="card-content">
                  <div class="card-header">
        <figure class="image is-48x48">
        <img src='https://openweathermap.org/img/w/${icon}.png' alt="Placeholder image">
        </figure>
                     <p class="card-header-title">${capLocation}</p>
                     <p class="card-header-title">${words}</p>
                  </div>
                  <div class="card-content">
                  <p class="today">Today - ${todayDate}</p>
                  
                     <p>Current Temperature - ${currentTemp}&deg;C </p>
                     <p>Feels Like - ${feelsLike}&deg;C</p>
                     <p>Humidity - ${humidity}</p>
                  </div>
					</div>
				</div>
   `;
	console.log('here');
}

// let div = document.getElementById('root').innerText(forecast)
// .appendChild(createWeatherIcon());
