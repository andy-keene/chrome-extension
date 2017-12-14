"use strict";

class PivotalAdapter {
  /* Returns a promise which resolves the tasks of the Pivotal story
      apiKey (string): users TrackerToken API Key
      storyId (string): story ID to fetch current tasks of
      teamId (string): users associated teamId (must be the teamId for the story we are posting to)
  */
  static getTasks(apiKey, storyId, teamId){
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      console.log("calling url", storyId);
      req.open("GET", `https://www.pivotaltracker.com/services/v5/projects/${teamId}/stories/${storyId}/tasks`);
      req.setRequestHeader("X-TrackerToken", apiKey)
  
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };
  
      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };
  
      // Make the request
      req.send();
    });
  }

  /* Returns a promise which resolves the StoryId of the active Pivotal chrome tab */
  static getStoryId(){
    return new Promise(function(resolve, reject){
      chrome.tabs.query({active: true}, (tabs) => {
              //find active pivotal tabs

              //FIX THIS
              let pivotalTabs = tabs.filter((tab) => {tab.active && tab.url.search(/pivotal/g) > 0});
              console.log("tabs found ", pivotalTabs);
              console.log("tabs", tabs);
              if (pivotalTabs.length !== 1){
                reject(`ERR: ${pivotalTabs.length} Pivotal tabs are active`);
              }

              //TODO: add validation on storyId
              let uriComponents = pivotalTabs[0].split('/').splice(-1)[0];
              let ids = uriCompnents.filter((item) => { 
                return item.match(/^\d+$/);
              });

              if (ids.length != 2){
                reject(`ERR: Unable to parse Story ID and Team ID`);
              }

              resolve({teamId: ids[0], storyId: ids[1]});
            });
    });
  }
}

/* Returns the storage value for the given key */
function load(key){
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get(key, function(items) {
      key in items ? resolve(items[key]) : reject(`ERR: Could not load ${key} from storage`);
    });
  });
}

/*
const listeners = [
  {button: "a button",
   element: "an element",}
  "post-tasks-action-btn",
  "teamId-save",
  "teamId-save"
]
*/

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("post-tasks-action-btn").addEventListener("click", function () {
    var apiKey, teamId, storyId;

    console.log("clicked post task");
    
    PivotalAdapter.getStoryId().then((resp) => {
      //load the story ID, and team ID
      teamId = resp.teamId;
      storyId = resp.storyId;
      return load("pivotalApiKey");
    }).then((resp) => {
      //load the API key
      console.log('loaded api key it is ', resp);
      apiKey = resp;
      //now return promise for loading the team ID
      return PivotalAdapter.getTasks(apiKey, "152483045", teamId);
    }).then((resp) => {
      //load pivotal response
      console.log("Success: ", resp);
    }).catch((err) => {
      //failure catch all
      console.log(err);
    });
    
  });
});