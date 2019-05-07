const https = require('https');
const http = require('http');
const api = require('./api');
const axios = require('axios')

function printMessage(data, date, query){
	let thisTemp = `The temperature in ${query} on ${date}: ${data.history.dailysummary[0].meantempi}° Fehrenheit`;
	console.log(thisTemp);
};

function errorMessage(error){
	console.error(`We're sorry, an error has occured: ${error.message}`);
};

async function getTemp(city, dates){
	const readableCity = city[0];
	const add = (a, b) => a + b;
	let totalHighTemp = [];
	let totalLowTemp = [];
	let responseCount = 0;
	const tempResponse = async function () {
		for (let date in dates){
			let thisDate = dates[date];
			try {
				const response = await axios.get(`https://api.darksky.net/forecast/${api.key}/${city[1]},${thisDate}T11:30:00?exclude=currently,minutely,hourly,flags`);
				if (!response.data) {
					const queryError = new Error(`There was a server oops lookin fer "${readableCity}" using the location "${city[1]}".`);
					errorMessage(queryError);
				} else {
					totalHighTemp.push(parseInt(response.data.daily.data[0].temperatureHigh));
					totalLowTemp.push(parseInt(response.data.daily.data[0].temperatureLow));
					responseCount += 1;
				}
				if (responseCount === 7) {
					const averageHigh = totalHighTemp.reduce(add, 0) / 7;
					const averageLow = totalLowTemp.reduce(add, 0) / 7;
					const averageTemp = Math.round(averageLow + ((averageHigh - averageLow) / 2));
					console.log(`The average temperature in ${readableCity} in ${dates[0].substring(0,4)} was ${averageTemp}° Fahrenheit`);
				}
			} catch (error) {
				errorMessage(error);
			};
		}
		while (responseCount <= 7) {
			setTimeout(function(){}, 100);
			if (responseCount === 7) {
				const averageHigh = totalHighTemp.reduce(add, 0) / 7;
				const averageLow = totalLowTemp.reduce(add, 0) / 7;
				const averageTemp = Math.round(averageLow + ((averageHigh - averageLow) / 2));
				return averageTemp;
			}
		}
	}
	const average = await tempResponse();
	return average;
};


module.exports.get = getTemp;
