//call 
const indexedDB =  window.indexedDB;

let db;
const request= indexedDB.open('budget', 1);

request.onupgradeneeded = function(e) {
    const db = request.result;
    db.createObjectStore('pending', {autoIncrement: true});
  };

//onerror
request.onerror = function(e) {
  //to get spefic err
  console.log("error"); 
}

//create fucntions to save the records that are cached
function saveRecord(data) {
  const transaction = db.transaction('pending', "readwrite");
  const store = transaction.objectStore('pending'); 

  store.add(data);
}
//create a fdunction taht checks the database amd if there is data run on success
function checkDatabase(event) {
  
}