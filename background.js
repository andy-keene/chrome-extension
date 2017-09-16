
function clicked(event){
  chrome.tabs.query({currentWindow: true, active: true}, (tabs)=>{
    // |tabs| == 1
    var currTab = tabs[0];
    console.log('tabs: ' + tabs.toString());

    // see: https://developer.chrome.com/extensions/tabs#method-executeScript
    // injects script into activeTab
    chrome.tabs.executeScript(currTab.id, {file: 'contentScript.js'})
  });
}

// invokes clicked() when the extension icon is clicked
chrome.browserAction.onClicked.addListener(clicked);

// for communication between content script and background page.
// in background.js, we're able to use the *.chrome API, whereas the 
// content script has limited access.
// see more on communications at: https://developer.chrome.com/extensions/messaging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
  if(sender.tab){
    console.log("Recieved a message from a content script.... (" + sender.tab.url + ")");
    sendResponse({message: 'goodbye'});
  }
});