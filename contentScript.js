/*
  see: https://developer.chrome.com/extensions/content_scripts
  note that this script runs in an isolated world so no conflicts should
  occur throughout execution.

  the return value object is:
  {
    ...
  }
*/

var hrefList = Array.from(
                  document.getElementsByTagName('a')
                ).map((element)=>{
                    return {
                      link: element.href,
                      text: element.text
                    }
                  });

// return the links found to the background page
chrome.runtime.sendMessage({linksFound: hrefList}, (response)=>{
    console.log('contentscript recieved the response: ' + response.message);
});