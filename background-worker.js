
const isAPIkeyFunctional = false;
const API_Url = "https://www.virustotal.com/api/v3/urls";
var API_KEY = "";

chrome.storage.sync.get(['API_KEY'], function(result) {
    API_KEY = result.API_KEY;
    });


//from chatgpt
chrome.runtime.onInstalled.addListener(() => {
    chrome.webNavigation.onCompleted.addListener(getVirusTotalResponse, {url: [{schemes: ['http', 'https']}]});
});

//from VT API docs


//based of YT video
async function getResponse(){
    const response = await fetch(API_Url, options);
    const data = await response.json();
}
getResponse();
