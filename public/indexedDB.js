//call 
const indexedDB =  window.indexedDB;

let db;
const request= indexedDB.open('budget', 1);

request.onupgradeneeded = function(e) {
    const db = request.result;
    db.createObjectStore('pending', {autoIncrement: true});
  };

  //onerror

  

  //create fucntions to save the records that are cached

//create a fdunction taht checks the database amd if there is data run on success