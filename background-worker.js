// Author           : Chua Philip
// Name of program  : CIPM - Cybersecurity Integrated Password Manager
// Program name     : background-worker.js
// Description      : Holds the code for the background worker of the extension. Runs the malicious link detection.
// First written on : 13/03/2023
// Last modified    : 20/03/2023

console.log("Hi from background-worker.js");

const API_Url = "https://www.virustotal.com/api/v3/urls"; //endpoint for the API

//Databases with known malicious URLs to test against the extension
// https://openphish.com/
// https://www.phishtank.com/


//declaration of variables
var isAPIkeyFunctional = false; //flag to check if an API key was provided
var API_KEY = "";
var checkedURLInstance = false; //flag to check if the URL has been checked
var currentUrl;
var trustedURLs=[];
var flag = false;

//placeholder to reset the trustedURLs database
// chrome.storage.sync.set({trustedURLs: trustedURLs}, function() {
//   console.log('Current list: ' + trustedURLs);
// });

/*-------------------------------------------------------
|                  supporting functions                 | 
--------------------------------------------------------*/

//function to check if the URL exists in the trustedURL database (chrome storage)
function checkCurrentDatabase(url)
{
  if (url in trustedURLs){
    return true;
  }
}

//function to get the report from the VirusTotal API
async function getVirusTotalReport(url){

  //breaks the function if the URL is already in the trustedURL database
  if (checkCurrentDatabase(url) == true){
    return;
  }

  //declaration of variables
  var report;
  var stats;

  //encoding the URL to be used in the API request
  encoded_url = btoa(url).replace(/=+$/, '');

  //initialising the API request headers/options
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
      console.log(response);
      chrome.notifications.create({
        type: 'basic',
        title: 'API request failed. Insert link to VirusTotal GUI website.',
        message: 'An unexpected error has occurred. Additional web requests might have happened in the process (False alarm). Ignore this error when the VirusTotal link is opened.',
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

  //if the API request is successful, check the report for malicious/suspicious URLs
  if (flag == true){
    stats = report.attributes.last_analysis_stats
    console.log(stats);

    //if the URL is malicious/suspicious, shows a desktop notifcation to the user and open the VirusTotal link in a new tab
    if ((stats.malicious > 0 || stats.suspicious > 0) && stats.harmless < 90) {
      chrome.notifications.create({
        type: 'basic',
        title: 'Malicious link detected.',
        message: 'The link you are trying to access is known to be malicious/suspicious. Please be careful. Link: ' + url + '',
        iconUrl: chrome.runtime.getURL('Icons/Logo128.png')
      });
      //creates a new tab with the VirusTotal link
      chrome.tabs.create({url: "https://www.virustotal.com/gui/url/"+report.id}, function(tab) {
        console.log("New tab created with ID: " + tab.id);
      });
    }

    //else, add the URL to the trusted URL database (chrome storage)
    else{
      trustedURLs.push(url);
      chrome.storage.sync.set({trustedURLs: trustedURLs}, function() {
        console.log('Current list: ' + trustedURLs);
      });
    }
    flag = false;
  }
}


//function to determine to execute the functions for malicious link detection
async function checkAPI (url)
{
  console.log("Current url:"+ url);
  //retrieve the API key from the chrome storage
  chrome.storage.sync.get(['API_KEY'], function(result) {
    API_KEY = result.API_KEY;
    console.log("API key:" + API_KEY);

  //sets the flag to be true if the API key was previously supplied
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
  //if the API key is supplied, execute the function to get the report from the VirusTotal API
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
        checkAPI(url);
      }
      });
    checkedURLInstance = true;
    }
  });
}

//pre-loading existing trusted URLs from the chrome storage
chrome.storage.sync.get(['trustedURLs'], function(result) {

  // Modify the var array by appending the existing URL from the chrome storage
  url = result.trustedURLs || [];
  trustedURLs.push(url);
});

console.log("Trusted URLs: " + trustedURLs);
//runs the main function
main();


