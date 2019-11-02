const temp = require('./temperature');
const query = process.argv.slice(2);
const cities = require('./cities.js');


let date1 = new Date();
let date2 = new Date();
const dates = [];
const dates2 = [];
const dateCreator = function (thisDate, i){
	i = parseInt(i);
	thisDate.setDate(query[i].substring(6,9));
	thisDate.setMonth(parseInt(query[i].substring(4,6)) - 1);
	thisDate.setFullYear(query[i].substring(0,4));
}
const dateArray = function(thisDate1, array) {
	for (let i = 0; i < 7; i += 1) {
		let dateString = thisDate1.toISOString().split('T')[0];
		array.push(dateString);
		thisDate1.setDate(thisDate1.getDate() + 1);
	};
}
dateCreator(date1, 0);
dateCreator(date2, 1);

dateArray(date1, dates);
dateArray(date2, dates2);

const tempTemp = async (name, dates) => {
	const totalTemp = [];
	let responseCount = 0;
	for (const date of dates) {
		totalTemp.push(`${name} ${date}`);
		responseCount += 1;
		console.log(`${totalTemp.toString()}`);
	}
	while (responseCount <= 7) {
		setTimeout(function(){}, 100);
		if (responseCount === 7) {
			console.log('done!');
			return totalTemp;
		}
	}
};


const getAverages = async (city, dateRange, dateRange2) => {
	const temp1 = await temp.get(city, dateRange);
	const temp2 = await temp.get(city, dateRange2);
	const tempArray = [temp1, temp2];
	return tempArray;
}

const runCities = async () => {
	for (let i = 0; i < cities.length; i++) {
	 	let tempArray = await getAverages(cities[i], dates, dates2);
	 	const difference = (tempArray[1] - tempArray[0]);
		const thisYearAverage = `${tempArray[1]}°`;
		const differenceString = `${difference}°`;
			console.log(`${cities[i][0]} was ${tempArray[0]}° in ${dates[0].substring(0,4)} and ${tempArray[1]}° in ${dates2[0].substring(0,4)}`);
		 	console.log(`The difference for ${cities[i][0]} was ${difference}°`);
		 	console.log(tempArray);
	};
};

runCities();
