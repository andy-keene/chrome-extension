'use strict';


/* Saves the users Pivotal API key */
document.getElementById("apiKey-save-btn").addEventListener("click", function(){
  var apiKey = document.getElementById("apiKey-input").value;
  save({'pivotalApiKey': apiKey});
  console.log(apiKey);
});

/* Saves the users Pivotal Team ID */
document.getElementById("teamId-save-btn").addEventListener("click", function(){
  var teamId = document.getElementById("teamId-input").value;
  save({'teamId': teamId});
  console.log(apiKey);
});

/* Saves the given item in local storage (save will sync across chrome browsers) */
function save(item){
    chrome.storage.sync.set(item, function() {
    alert('Settings saved');
  });
}

/* Returns the storage value for the given key */
function load(key){
    chrome.storage.sync.get(key, function(items) {
    return key in items ? items[key] : null;
  });
}
