
const database = require('./database');


async function InsertNewUser(data){
    const connection = await database.getConnection;
    const curDate = new Date();

    const [checkPhoneN,t]= await connection.execute("SELECT phoneN FROM `guest` WHERE `phoneN`= ?",[data.inputNumber]);

    if (Object.keys(checkPhoneN).length==0 ){
    const [rows, fields] = await connection.execute("INSERT INTO `guest`(`fname`, `lname`, `email`, `phoneN`, `nationality`, `joinDate`) values (?,?,?,?,?,?)", 
     [data.inputFirstName,data.inputLastName,data.inputEmail,data.inputNumber,data.inputNationality,curDate ] );  
     }
    
     const [rows2, fields2] = await connection.execute("INSERT INTO booked(guestPhoneN, tripName, tripWebsite, price, extraCash, date, time, kPay, nofGuests,notes) VALUES  (?,?,?,?,?,?,?,?,?,?)", 
    [data.inputNumber, data.inputTripName, data.inputWebsite, data.inputTripPrice,data.inputTripExtraPrice, data.inputDate, data.inputTime, "0", data.inputNGuests,"" ] );

}

async function selectUpComingBooking(){
    const connection = await database.getConnection;
    const [rows, fields] = await connection.execute( " SELECT `fname`, `lname`, `email`, `phoneN`,`tripName` ,`nationality`, `tripWebsite`, `time`, DATE_FORMAT(date, '%Y-%m-%d') as realDate, booked.nofGuests as nOfGuests  FROM `guest` INNER JOIN booked ON phoneN = booked.guestPhoneN WHERE date >= CURDATE()");
    const resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
    console.log(resultArray);

    return resultArray;
};


async function getUserData(phoneN,tripName){
    const connection = await database.getConnection;
    const [rows,t]= await connection.execute("SELECT `fname`, `lname`, `email`, `phoneN`,`tripName` ,`nationality`, `tripWebsite`, notes, price, extraCash, `time`,kpay, DATE_FORMAT(date, '%Y-%m-%d') as date ,booked.nofGuests as nOfGuests  FROM `guest` INNER JOIN booked ON phoneN = booked.guestPhoneN WHERE phoneN = ? AND tripName = ? ",[phoneN,tripName]);
    console.log(rows);
    return rows;
};


async function updateUserData(data){
    const connection = await database.getConnection;
    var checkPrimarykey = "";

    const [rows, fields] = await connection.execute( "UPDATE `guest` SET `fname` = ?, `lname` = ?, `nationality` =?, `phoneN` =?  WHERE `phoneN` = ? ",
    [data.inputFirstName,data.inputLastName,data.inputNationality,data.inputNumber,data.inputOldNumber] );

    //check if the primary key changed or not and place the new value as the new primary key in "checkPrimarykey"
    if (data.inputOldNumber!=data.inputNumber) checkPrimarykey = data.inputNumber;
    else checkPrimarykey = data.inputOldNumber;

    console.log("I finished updating user data");
    const [rows2, fields2] = await connection.execute( `UPDATE booked SET tripName = ?,tripWebsite = ?,price = ?,extraCash = ?,notes = ?,date = ?,time = ?,kPay = ?, nofGuests = ? WHERE guestPhoneN = ? And tripName = ? `,
    [data.inputTripName,data.inputWebsite,data.inputTripPrice,data.inputTripExtraPrice,data.inputNote,data.inputDate,data.inputTime,data.inputKpay,data.inputNGuests,checkPrimarykey,data.inputOldTripName] );
    console.log("I finished updating trip data");

};
    
// i finished here
async function deleteUserTrip(phoneN,tripName){
    const connection = await database.getConnection;
    const [rows, fields] = await connection.execute( " DELETE FROM `booked`  WHERE `guestPhoneN` = ? AND tripName = ? ",[phoneN,tripName]);
    return rows;
};


async function selectAllUsers(){
    const connection = await database.getConnection;
    const [rows, fields] = await connection.execute("SELECT `fname`, `lname`, `email`, `phoneN`,`tripName` ,`nationality`, `tripWebsite`,kpay, `time`, DATE_FORMAT(date, '%Y/%m/%d') AS date ,booked.nofGuests as nOfGuests  FROM `guest` INNER JOIN booked ON phoneN = booked.guestPhoneN ORDER BY fname ");
    const resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
    return resultArray;
};


async function selectUnpaidTripsK(){
    const connection = await database.getConnection;
    const [rows, fields] = await connection.execute("SELECT `fname`, `lname`, `phoneN`,`tripName` , `tripWebsite`,`kpay`,`price`,`extraCash`, DATE_FORMAT(date, '%Y/%m/%d') AS dateFormated ,booked.nofGuests as nOfGuests FROM `guest` INNER JOIN booked ON phoneN = booked.guestPhoneN WHERE `kpay`= 0 ");
    const resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
    console.log(resultArray);
    return resultArray;
};

async function changeToPaidTripK(phone,tripName){
    const connection = await database.getConnection;
    const [rows, fields] = await connection.execute("UPDATE `booked` SET `kPay`='1' WHERE `guestPhoneN` = ? AND `tripName` = ?",[phone,tripName]);
    console.log(rows);
};


async function decodePhoneN(phoneN){
    if (phoneN[0]==='k' || phoneN[0]==='a' || phoneN[1]==='k' || phoneN[1]==='a')
        phoneN = phoneN.replace("k", "+").replace("a", "#");
    return phoneN;
};

module.exports ={
    InsertNewUser:InsertNewUser,
    updateUserData:updateUserData,
    selectUpComingBooking:selectUpComingBooking,
    deleteUserTrip:deleteUserTrip,
    selectUnpaidTripsK:selectUnpaidTripsK,
    selectAllUsers:selectAllUsers,
    getUserData:getUserData,
    changeToPaidTripK:changeToPaidTripK,
    decodePhoneN:decodePhoneN
}
