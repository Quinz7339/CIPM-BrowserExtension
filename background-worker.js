console.log("Hi from background-worker.js");

//endpoint for the API
const API_Url = "https://www.virustotal.com/api/v3/urls";

//Databases with known malicious URLs
// https://openphish.com/
// https://www.phishtank.com/


//declaration of variables
var isAPIkeyFunctional = false;
var API_KEY = "";
var checkedURLInstance = false;
var currentUrl;
var trustedURLs=[];
var maliciousURLs=[];
var flag = false;

//pre-loading existing malicious URLs from the chrome storage
// chrome.storage.sync.get(['maliciousURLs'], function(result) {
//   // Modify array by appending new URL
//   url = result.maliciousURLs || [];
//   maliciousURLs.push(url);
// });

// //pre-loading existing trusted URLs from the chrome storage
// chrome.storage.sync.get(['trustedURLs'], function(result) {
//   // Modify array by appending new URL
//   url = result.trustedURLs || [];
//   trustedURLs.push(url);
// });

// console.log("Trusted URLs: " + trustedURLs);
// console.log("Malicious URLs: " + maliciousURLs);


// function checkCurrentDatabase(url)
// {
//   if (url in maliciousURLs){
//     chrome.showNotification("Malicious URL detected!");
//   }
// }

//function to get the report from the VirusTotal API
async function getVirusTotalReport(url){
  flag = false;
  var report;
  var stats;
  encoded_url = btoa(url).replace(/=+$/, '');
  const options = {
    method: 'GET',
    headers: 
      {accept: 'application/json',
      'x-apikey': API_KEY}
    };
  try{
    response = await fetch(API_Url+"/"+encoded_url, options);
    if (response.ok) {
      console.log("success");
      response = await response.json() //jsonify the response
      report = response.data;
      console.log(report);
      flag = true;
    }
    //Error 401 - errors related to VirusTotal account and authentication
    else if (response.status == 401) {
      chrome.notifications.create({
        type: 'basic',
        title: 'API request failed.',
        message: 'Error 401: The supplied API key is invalid. Please enter a valid API key in the Settings page or ensure your VirusTotal Account is active.',
        iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
      });
    }

    //Error 429 - API request quota related error
    else if (response.status == 429) {
      chrome.notifications.create({
        type: 'basic',
        title: 'API request failed. Quota exceeded.',
        message: 'Error 429: The API request quota has been exceeded (4 per minute for normal accounts) or too many requests are being made. Please try again later.',
        iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
      });

    //Miscellaneous errors from VirusTotal API
    }else {
      chrome.notifications.create({
        type: 'basic',
        title: 'API request failed.',
        message: 'An unexpected error has occurred. Please try again later. Ignore this error when the VirusTotal link is opened.',
        iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
      });
    }
  }
  //Error from unexpected exceptions.
  catch(error) {
    chrome.notifications.create({
      type: 'basic',
      title: 'Exception error.',
      message: 'An unexpected error has occurred. ',
      iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
    });
  }
  if (flag == true){
    stats = report.attributes.last_analysis_stats
    console.log(stats);
    if ((stats.malicious > 0 || stats.suspicious > 0) && stats.harmless < 90) {
      chrome.notifications.create({
        type: 'basic',
        title: 'Malicious link detected.',
        message: 'The link you are trying to access is known to be malicious/suspicious. Please be careful. Link: ' + url + '',
        iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
      });
      // maliciousURLs.push(url);
      // chrome.storage.sync.set({maliciousURLs: maliciousURLs}, function() {
      //   console.log('New malicious URL added to storage: ' + url);
      // });
      console.log(report.id)
      //self.clients.openWindow("https://www.virustotal.com/gui/url/"+report.id);
      chrome.tabs.create({url: "https://www.virustotal.com/gui/url/"+report.id}, function(tab) {
      console.log("New tab created with ID: " + tab.id);
      });
    }
  }
  else{
    // chrome.storage.sync.set({trustedURLs: trustedURLs}, function() {
    //   console.log('New trusted URL added to storage: ' + url);
    // });
  }
}


//function to determine to execute the malicious link detection functions
async function run (url)
{
  console.log("Current url:"+ url);
  //retrieve the API key from the chrome storage
  chrome.storage.sync.get(['API_KEY'], function(result) {
    API_KEY = result.API_KEY;
    console.log("API key:" + API_KEY);
  if (API_KEY != null || API_KEY != undefined) {
    isAPIkeyFunctional = true;
  }
  else {
    isAPIkeyFunctional = false;
    chrome.notifications.create({
      type: 'basic',
      title: 'No API key is supplied.',
      message: "Please supply an API key in the Settings page of the extension.",
      iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
    });
    return
  }
  if (isAPIkeyFunctional) {
    getVirusTotalReport(url);
  }
  });
}


/*-------------------------------------------------------
|                      main function                    | 
--------------------------------------------------------*/
async function main(){
  //sets the flag to be false when the tab is changed
chrome.tabs.onActivated.addListener(() => {
  checkedURLInstance = false;
});

//changes the flag to be false when the url is changed, and reassigns the currentUrl variable 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url && (changeInfo.url.startsWith("http") || changeInfo.url.startsWith("https"))) {
    if (changeInfo.url !== currentUrl) {
      try{console.log("Previous url: "+ currentUrl);}catch{}
      currentUrl = changeInfo.url;
      checkedURLInstance = false;
    }
  }
});

//checks if the content of the tab is loaded.
chrome.webNavigation.onDOMContentLoaded.addListener(() => {
  //this block only runs if the flag is false = the currentUrl is different to the previous one
  if (!checkedURLInstance) {
    //queries the current active tab and window, and retrieves the url
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    url = tabs[0].url;
    if (url.startsWith("http") || url.startsWith("https") ) {
      checkedURLInstance = true;
      run(url);
    }
    });
  checkedURLInstance = true;
  }
  });
}

//runs the main function
main();


