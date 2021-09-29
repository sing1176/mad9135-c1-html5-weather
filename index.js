import { getForecast } from './weatherService.js';
import { getGeolocation } from './mapService.js';

// Grab Input and pass it to Search
let searchBtn = document
	.getElementById('searchBtn')
	.addEventListener('click', () => {
		let input = document.getElementById('input').value;
		if (!input) {
			return;
		}
		main(input);
	});

let weekly = [];

let hourly = [];

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
	weekly = forecast.daily;
	hourly = forecast.hourly;
	console.log(weekly);
	console.log(hourly);
	let currentTemp = Math.floor(forecast.current.temp);
	let feelsLike = Math.floor(forecast.current.feels_like);
	let todayDate = new Date(forecast.current.dt * 1000);
	forecast.current.dt;
	let humidity = forecast.current.humidity;
	let description = forecast.current.weather[0].description;
	let icon = forecast.current.weather[0].icon;
	buildWeekView();
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
}

let currentLocation = document
	.getElementById('currentLocation')
	.addEventListener('click', getCurrentCoords);

async function getCurrentCoords() {
	let options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	};

	function success(pos) {
		let coords = pos.coords;
		let currentCoords = {
			lat: coords.latitude,
			lon: coords.longitude,
		};
		useCoords(currentCoords);
	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}
	navigator.geolocation.getCurrentPosition(success, error, options);
}

// building card with device coordinates

async function useCoords(currentCoords) {
	const forecast = await getForecast(currentCoords);
	console.log(forecast);
	weekly = forecast.daily;
	hourly = forecast.hourly;
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
	let today = document.getElementById('today');
	today.innerHTML = `
   <div class="card">
					<div class="card-content">
                  <div class="card-header">
        <figure class="image is-48x48">
        <img src='https://openweathermap.org/img/w/${icon}.png' alt="Placeholder image">
        </figure>
                     <p class="card-header-title">Your Location</p>
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

	buildWeekView();
}

function buildWeekView() {
	document.getElementById('switch').style.display = 'block';
		let weekCard = (document.getElementById('week').innerHTML = weekly.map(day=>{
			let min= Math.floor(day.temp.min);
			let max = Math.floor(day.temp.max);
			let description = day.weather[0].main;
			let icon = day.weather[0].icon 
         let dayDate = new Date(day.dt * 1000);

         return `
         <div class="column">
         <div class="card">
					<div class="card-content">
                  <div class="card-header">
						 <figure class="image is-48x48">
        <img src='https://openweathermap.org/img/w/${icon}.png' alt="Placeholder image">
        </figure>
                     <p class="card-header-title ">${dayDate}</p>
                  </div>
						<p class="today">Weather - ${description} </p>
						<p class="today">Min - ${min}&deg;C</p>
                  <p class="today">Max - ${max}&deg;C</p>
					</div>
				</div>
      </div>
         `;
      }));
	;
}

document.getElementById('switch').addEventListener('click',buildHourly)
 function buildHourly() {
	 let fewHours = hourly.slice(0,6)
	 console.log(fewHours);
		let weekCard = (document.getElementById('week').innerHTML = fewHours.map(
			(hour) => {
				console.log(hour);
				let temp = Math.floor(hour.temp);
				let feels = Math.floor(hour.feels_like);
				let description = hour.weather[0].main;
				let icon = hour.weather[0].icon;

				let dayDate = new Date(hour.dt * 1000);
				return `
         <div class="column">
         <div class="card">
					<div class="card-content">
                  <div class="card-header">
						 <figure class="image is-48x48">
        <img src='https://openweathermap.org/img/w/${icon}.png' alt="Placeholder image">
        </figure>
                     <p class="card-header-title ">${dayDate}</p>
                  </div>
						<p class="today">Weather - ${description} </p>
						<p class="today">Current Temperature - ${temp}&deg;C</p>
                  <p class="today">Feels Like - ${feels}&deg;C</p>
					</div>
				</div>
      </div>
         `;
			}
		));
 }
