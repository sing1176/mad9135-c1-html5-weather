const API_TOKEN = 'pk.19d9e0b6011cf0841dd8c2684f835e85';
const BASE_URL = 'https://us1.locationiq.com/v1';

export async function getGeolocation(location) {
	const url = `${BASE_URL}/search.php?key=${API_TOKEN}&q=${location}&format=json`;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(response.statusText);
	}
	const data = await response.json();
	console.log(data);
	return { lat: data[0].lat, lon: data[0].lon };
}
