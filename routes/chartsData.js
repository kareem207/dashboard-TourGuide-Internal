const database = require('./database');


// Statistics
async function selectTotals(){
    const connection = await database.getConnection;
    const [totalProfit, fields1] = await connection.execute(" SELECT SUM(price)+SUM(extraCash) AS totalProfit FROM booked ");
    const [upComingTripsThisMonth, fields2] = await connection.execute(" SELECT COUNT(*) AS upComingTripsThisMonth FROM booked WHERE date >= CURDATE()  AND MONTH(date) = MONTH(CURDATE()) ");
    const [topWebsite, fields3] = await connection.execute(" SELECT `tripWebsite` AS topWebsite, COUNT(`tripWebsite`) AS  `numberOftime` FROM     booked GROUP BY `tripWebsite` ORDER BY `numberOfTime` DESC ");
    const [topTrip, fields4] = await connection.execute(" SELECT `tripName` AS topTrip,  COUNT(`tripName`) AS `numberOfTimes` FROM   booked  GROUP BY `tripName`  ORDER BY `numberOfTimes` DESC  LIMIT  1");

   var totalNumberOfWebsitesBooking=0;
   var totalWebsitePrecintage = [];
    for (var i=0; i<topWebsite.length ; i++){
        totalNumberOfWebsitesBooking += parseInt(topWebsite[i].numberOftime);
    }
    for (var i=0; i<topWebsite.length ; i++){
        totalWebsitePrecintage[i] = parseInt( (topWebsite[i].numberOftime/totalNumberOfWebsitesBooking)*100 );
    }
    rowsObject= {
        rows1:totalProfit,
        rows2:upComingTripsThisMonth,
        rows3:topWebsite,
        rows4:topTrip,
        totalWebsitePrecintage:totalWebsitePrecintage
    }
    const resultArray = Object.values(JSON.parse(JSON.stringify(rowsObject)));

    return resultArray;
};

async function incomePerMonth(){
    const connection = await database.getConnection;
    const [data, fields4] = await connection.execute("SELECT SUM(price)+SUM(extraCash) as income, month(date) as mon FROM booked GROUP BY month(date) ORDER BY mon ASC ");
    var arr = [0,0,0,0,0,0,0,0,0,0,0,0];

    data.forEach((i) => { 
        var index = parseInt(i.mon) - 1;
        arr[index] = i.income;
    })

    return arr;
};

async function travllersPerTrip(){
    const connection = await database.getConnection;
    const [data, fields4] = await connection.execute("SELECT `tripName`,  COUNT(`tripName`) AS `numberOfTimes` FROM   booked  GROUP BY `tripName`  ORDER BY `numberOfTimes` ");

    const resultArray = Object.values(JSON.parse(JSON.stringify(data)));
    return resultArray;
};




module.exports ={
    selectTotals:selectTotals,
    incomePerMonth:incomePerMonth,
    travllersPerTrip:travllersPerTrip
}