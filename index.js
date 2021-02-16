const MyAirtable = require('./airtable');
const https = require("https");

const tableName = "BTC Table";
const airtable = new MyAirtable(tableName);
const timeoutTime = 60000;
const currency = 'USD';
const field = "last";
let previousStatus = "OK";
let savedRecords = [];


// Handles the case when airtable returned a status that was not "OK" currently or in the past
// if the current status is ok and the last status was not -> will add the missed records in the past
// if the current status is not ok -> will save record to be sent in the future
// if the current status is ok and was ok last time -> do nothing
function checkStatus(currentStatus, record){
  // add the missed records to the airtable
    if(currentStatus == "OK" & previousStatus != "OK") {
      airtable.addRecords(savedRecords);
      savedRecords = [];
      
      // save the current record and will add later
    } else if (currentStatus != "OK") {
      savedRecords.push(record)
    }
    previousStatus = currentStatus;
  }

// Send the current rate record to the airtable 
function sendToAirtable(currentRate){
    records = []
    let now = new Date();
    let record = {time: now, rate : Number(currentRate)}
    records.push(record);
    let status = airtable.addRecords(records);
    //status = "Not OK";
  
    // handle if status is not "OK" 
    checkStatus(status, record);

}

// Requests and Https request and parses the data when response is ready will send to airtable
// the current exchnage rate

function getRate(){
  const url = 'https://blockchain.info/ticker';
  https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      let data = JSON.parse(body);
      currentRate = data[currency][field]
      console.log("current currency", data[currency][field]);
       sendToAirtable(currentRate);
    });
  });
};

// starts the program and resets the timer to collect the future exchange rate
function start() {
  getRate();
  setTimeout(start, timeoutTime);
}

start();
