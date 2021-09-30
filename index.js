import { getForecast } from './weatherService.js';
import { getGeolocation } from './mapService.js';

const STORAGE = {
	keys: [],

	results:[],

	saveKey(forecast) {
		let key = document.getElementById('input').value.toLowerCase();
		localStorage.setItem(key, JSON.stringify(forecast));
		STORAGE.keys.push(key);
	},

	findKey(key) {
		let storage = localStorage.getItem(key);
		storage = JSON.parse(storage);
		STORAGE.keys.push(key);
		return storage;
	},
};

const APP = {
	forecast: [],

	hourlyView: false,

	findInStorage() {
		console.log('looking in storage');
		let input = document.getElementById('input').value;
		if (input) {
			let key = input.toLowerCase();
			console.log(STORAGE.keys);
			if (STORAGE.keys.includes(key)) {
				let data = STORAGE.findKey(key);
				console.log(data);
			} else console.log('Not in storage fetching through the web');
			APP.data();
		}
	},
	init() {
		console.log('App init');
		APP.search();
		APP.switchView();
		APP.useLocation();
		APP.useCoords()
	},
	search() {
		document.getElementById('searchBtn').addEventListener('click', () => {
			let input = document.getElementById('input').value;
			if (!input) {
				console.log('no input provided');
				return;
			} else {
				APP.findInStorage();
				// APP.data();
				// console.log(`searching for ${input}`);
			}
		});
	},
	async data() {
		try {
			let location = document.getElementById('input').value;
			const coord = await getGeolocation(location);
			const forecast = await getForecast({ coord });
			STORAGE.saveKey(forecast);
			APP.forecast = forecast;
			APP.results = forecast;
			APP.buildTodayCard();
			APP.buildWeekCards();
		} catch (error) {
			console.log(error.message);
		}
	},
	useLocation() {
		let locationButton = document
			.getElementById('locationButton')
			.addEventListener('click', async () => {
				console.log('Using Current location');

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
					console.log(` Your coords are ${currentCoords}`);
					APP.useCoords(currentCoords);
				}
				function error(err) {
					console.warn(`ERROR(${err.code}): ${err.message}`);
				}
				navigator.geolocation.getCurrentPosition(success, error, options);
			});
	},
	async useCoords(currentCoords) {
		const forecast = await getForecast(currentCoords);
		APP.forecast = forecast;
		APP.buildTodayCard();
		APP.buildWeekCards();
	},

	buildTodayCard() {
		console.log(APP.forecast);
		let location = document.getElementById('input').value;
		if (location == '') {
			location = 'Your location';
		}

		let forecast = APP.forecast;
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
   <div class="card ">
					<div class="card-content">
                  <div class="card-header">
        <figure class="image is-48x48">
        <img src='https://openweathermap.org/img/w/${icon}.png' alt="Placeholder image">
        </figure>
                     <p class="card-header-title">${location}</p>
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
	},
	buildWeekCards() {
		console.log('I am in weekly view');
		let btn = document.getElementById('switch');
		btn.textContent = 'Switch to Hourly view';
		btn.style.display = 'block';
		let weekCard = (document.getElementById('week').innerHTML =
			APP.forecast.daily.map((day) => {
				let min = Math.floor(day.temp.min);
				let max = Math.floor(day.temp.max);
				let description = day.weather[0].main;
				let icon = day.weather[0].icon;
				let dayDate = new Date(day.dt * 1000);
				return `
	         <div class="column four-fifths-desktop four-fifths-tablet">
	         <div class="card container">
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
	},
	buildHourCards() {
		console.log('I am in Hourly view');
		APP.hourlyView = true;
		let btn = document.getElementById('switch');
		btn.textContent = 'Switch to Weekly view';
		let fewHours = APP.forecast.hourly.slice(0, 6);
		console.log(fewHours);
		document.getElementById('week').innerHTML = fewHours.map((hour) => {
			let temp = Math.floor(hour.temp);
			let feels = Math.floor(hour.feels_like);
			let description = hour.weather[0].main;
			let icon = hour.weather[0].icon;
			let dayDate = new Date(hour.dt * 1000);
			return `
		         <div class="column column four-fifths-desktop four-fifths-tablet">
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
		});
	},
	switchView() {
		document.getElementById('switch').addEventListener('click', () => {
			console.log('switching');

			if (APP.hourlyView == false) {
				APP.buildHourCards();
			} else {
				APP.buildWeekCards();
				APP.hourlyView = false;
			}
		});
	},
};

document.addEventListener('DOMContentLoaded', APP.init);