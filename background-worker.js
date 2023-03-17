console.log("Hi from background-worker.js");
var isAPIkeyFunctional = false;
const API_Url = "https://www.virustotal.com/api/v3/urls";
var API_KEY = "";

chrome.runtime.onInstalled.addListener(() => {
    chrome.webNavigation.onCompleted.addListener(run, {url: [{schemes: ['http', 'https']}]});
});


async function run (details)
{
    console.log(details.url);
    chrome.notifications.create({
        type: 'basic',
        title: 'Malicious website detected',
        message: `The website ${details.url} has been detected as malicious.`,
        iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
    });
    //alert("Hi from background-worker.js"); deprecated in manifest v3
}


//retrieves the saved API key from the chrome storage
chrome.storage.sync.get(['API_KEY'], function(result) {
    API_KEY = result.API_KEY;
    console.log(API_KEY);

    if (API_KEY != null || API_KEY != undefined) {
        isAPIkeyFunctional = true;
        console.log("API key is functional");
    }
    else {
        isAPIkeyFunctional = false;
        console.log("API key is not functional");
    }
});


async function getVirusTotalID(user_url){
    const API_Url = 'https://www.virustotal.com/api/v3/urls';
  
    //initializing the POST request
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'x-apikey': API_KEY,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({url: user_url})
      };
    console.log(options);
    
    try{
  
      response = await fetch(API_Url, options)
      console.log(response);
      
      if (response.ok) {
        console.log("success");
        data = await response.json(); //this works now
        dataId = data.id;
        console.log("Data:" + data);
        console.log("ID:" + dataId);
      }
      else if (response.status == 403 || response.status == 401) {
        alert("The API request has failed. The supplied API key might be invalid or the request quota might have been exceeded. Response: "+data)
      }else {
        alert("The API request has failed. Response: "+data)
      }
    }
    catch (error) {
      alert("An unexpected error has occurred. Please try again later. Error: "+error);
    }
  
  };
  
async function getVirusTotalReport(url) {
    id = await getVirusTotalID(url);
    console.log(id);
};



//from chatgpt




//main process to run in the background
//run()

//from chatgpt
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     url = tabs[0].url; //fetches the currently active tab's url
//     console.log(url);
//     if (url.indexOf("http") == 0 || url.indexOf("https") == 0) {
//     getVirusTotalReport(url);
//     }
//     else{
//     alert("The URL does not start with http or https.");
//     }
// });
