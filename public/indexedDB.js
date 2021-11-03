//call 
const indexedDB = window.indexedDB;

let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore('pending', { autoIncrement: true });
};

request.onsuccess = function (e) {
  db = e.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

//onerror
request.onerror = function (e) {
  //to get spefic err
  console.log("error:" + e.target.errorCode);
}

//create fucntions to save the records that are cached
function saveRecord(data) {
  const transaction = db.transaction(['pending'], "readwrite");
  const store = transaction.objectStore('pending');

  store.add(data);
}

//create a fdunction taht checks the database amd if there is data run on success
function checkDatabase() {
  const transaction = db.transaction(['pending'], "readwrite");
  const store = transaction.objectStore('pending');
  const all = store.getAll();

  all.onsuccess = function () {
    if (all.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(all.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(() => {
        const transaction = db.transaction(['pending'], "readwrite");
        const store = transaction.objectStore('pending');
        store.clear();
      });
    }
  };

}

window.addEventListener('online', checkDatabase);