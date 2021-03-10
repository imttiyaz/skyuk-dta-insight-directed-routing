'use strict';

const MOMENT = require('moment');




function startLog(data, startTime) {
    console.log(`${data} ${startTime}`);
}

function endLog(data, startTime) {
    var endTime = MOMENT();
    var timeTaken = endTime.diff(startTime);
    data += "    " + endTime.format("YYYY-MM-DD'T'HH:mm:ss:SSSZ") + " timeTaken " + timeTaken;
    // console.log(data);
}

function logData(data) {

    console.log(`${data} model-Executed : ${process.env.DATABASE_MODEL_NAME}`);
    
}


module.exports = { startLog, endLog,logData }
