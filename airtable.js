const private = require('./privateInfo');
const Airtable = require('airtable');

const USER_API_KEY = private.USER_API_KEY;
const BASE_KEY = private.BASE_KEY;

// This class creates holds the airtable insatnce and adds records to the table
class myAirtable {

  constructor(tableName){
    this.base = new Airtable({apiKey: USER_API_KEY}).base(BASE_KEY);
    this.table = tableName;
  }

  
// Will add new record enteries into the airtable
// returns "OK" if adding the new entereies was successful otherwise will return "Not OK"
addRecords(records) {
    records.forEach(record => {
        this.base(this.table).create([
            {
              "fields": {
                "Time": record.time,
                "Rates": record.rate
              }
            }],function(err, records) {
              
                if (err) {
                  console.error(err);
                  return "Not OK";
                 } 
                records.forEach(function (record) {
                  console.log("new record created -> id:", record.getId());
                });
              });
    })
   return "OK";
}

}

module.exports = myAirtable;
