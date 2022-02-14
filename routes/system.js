const database = require('./database');

async function checkLogin(username,password){

    const connection = await database.getConnection;
    const [checkUser, fields1] = await connection.execute("SELECT * FROM `sysusers` WHERE username = ? AND password = ?",[username,password] );

    const resultArray = Object.values(JSON.parse(JSON.stringify(checkUser)));
    console.log(resultArray);
    return resultArray;
}


module.exports = {
    checkLogin:checkLogin
}