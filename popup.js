console.log("Start");

//declaring the links to the RSS news feeds
const feeds = [
    { title: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
    { title: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' }
  ];

//declaring the API key for the VirusTotal malicious link detection as well as the currently visited URL
var API_KEY = "";
chrome.storage.sync.get(['API_KEY'], function(result) {
  API_KEY = result.API_KEY;
  });

// Gets the reference to the buttons and fields from the HTML document
const btn_News = document.getElementById('btn_News');
const btn_Connect = document.getElementById('btn_Connect');
const btn_Settings = document.getElementById('btn_Settings');

function setAPIKey() {
  const response = document.createElement('p');
  response.id = "response";
  response.style.color = "green";
  response.innerText = "API Key saved successfully!";
  document.getElementById('container').appendChild(response);
  chrome.storage.sync.set({API_KEY: API_KEY}, function() {
    console.log('Entered value is: ' + API_KEY);
  });
}

btn_News.addEventListener('click', function() {
    //Clearing the content of the container
    document.getElementById('container').innerHTML = '';

    //Creating the divs for the feeds
    const darkContainer = document.createElement('div');
    darkContainer.id = 'dark-reading-feed-container';
    document.getElementById('container').appendChild(darkContainer);

    const hackerContainer = document.createElement('div');
    hackerContainer.id = 'the-hacker-news-feed-container';
    document.getElementById('container').appendChild(hackerContainer);

    // Loop through each feed and fetch the corresponding RSS feed
    for (let i = 0; i < feeds.length; i++) {
        const feed = feeds[i];
        
        const header = document.createElement('h2');
        header.innerText = feed.title;
        console.log(feed.title.toLowerCase().replaceAll(' ', '-'));
        document.getElementById(feed.title.toLowerCase().replaceAll(' ', '-') + '-feed-container').appendChild(header);

        // Fetch the RSS feed
        fetch(feed.url)
          .then(response => response.text())
          .then(xmlString => {
            // Parse the XML string into an XML document
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlString, 'text/xml');
      
            // Get the items from the XML document
            const items = xml.querySelectorAll('item');
      
            // Loop through each item and create a new link element for each one
            for (let j = 0; j < 5; j++) {
              const item = items[j];
              // Get the title, link, thumbnail, and description of the item
              const title = item.querySelector('title').textContent;
              const link = item.querySelector('link').textContent;

              //Note to developer: can consider adding a check to see if the thumbnail exists or not
              const thumbnail=item.querySelector('enclosure') ? item.querySelector('enclosure').getAttribute('url') : null;
              const description = item.querySelector('description').textContent;
      
              // Create a new link element for the item. 'a' refers to the HTML tag <a>
              const linkElement = document.createElement('a');
              linkElement.href = link;
              linkElement.target = '_blank';
      
              // Create a new container element for the link and thumbnail
              const containerElement = document.createElement('div');
              containerElement.classList.add('link-container');
      
              // Add the thumbnail image to the container element, if one exists
              if (thumbnail) {
                const thumbnailElement = document.createElement('img');
                thumbnailElement.src = thumbnail;
                thumbnailElement.alt = title;
                containerElement.appendChild(thumbnailElement);
              }
      
              // Add the link text to the container element
              const linkTextElement = document.createElement('div');
              linkTextElement.classList.add('link-text');
              linkTextElement.innerHTML = `<h3>${title}</h3>${description}`;
              containerElement.appendChild(linkTextElement);
      
              // Append the container element to the link element
              linkElement.appendChild(containerElement);
      
              // Append the link element to the appropriate feed div
              if (feed.title === 'Dark Reading') {
                document.getElementById('dark-reading-feed-container').appendChild(linkElement);
              } else if (feed.title === 'The Hacker News') {
                document.getElementById('the-hacker-news-feed-container').appendChild(linkElement);
              }
            }
          });
      }
});

btn_Settings.addEventListener('click', function() {
  document.getElementById('container').innerHTML = '';
  console.log(API_KEY);

  //creating and initializing the settings page
  //creating header for the settings page
  const header = document.createElement('h2');  
  header.innerText = "Settings";

  //creating subheader for the API key input
  const title = document.createElement('h3'); 
  title.innerText = "Insert the API key for the VirusTotal malicious link detection.";

  //creating the input field for the API key
  const txt_APIKey = document.createElement('input'); 
  txt_APIKey.type = "text";
  txt_APIKey.id = "txt_APIKey";
  txt_APIKey.placeholder = "Insert API Key";
  
  //Check if the API key is already stored in the chrome storage
  chrome.storage.sync.get(['API_KEY'], function(result) {
    if (result.API_KEY != null || result.API_KEY != undefined) {
      txt_APIKey.value = result.API_KEY;
    }});
  
  //creating the save button for the API key
  const btn_SaveAPIKey = document.createElement('button');
  btn_SaveAPIKey.id = "btn_SaveAPIKey";
  btn_SaveAPIKey.innerText = "Save";
  btn_SaveAPIKey.disabled = true;
  btn_SaveAPIKey.title = "API Key must be 64 characters long";
  btn_SaveAPIKey.style.backgroundColor = "grey";

  //eventListener for the input field to check if the API key is 64 characters long and enable the save button accordingly
  txt_APIKey.addEventListener('input', function(){
    if (txt_APIKey.value.length == 64) {
      btn_SaveAPIKey.style.backgroundColor = "#4CAF50";
      btn_SaveAPIKey.disabled = false;    
    }
    else {
      btn_SaveAPIKey.style.backgroundColor = "grey";
      btn_SaveAPIKey.disabled = true;
    }
  });

  //saving the API key to the chrome storage upon clicking the save button
  btn_SaveAPIKey.addEventListener('click', function(){
    API_KEY = document.getElementById('txt_APIKey').value;
    setAPIKey();
  });

  document.getElementById('container').appendChild(header);
  document.getElementById('container').appendChild(title);
  document.getElementById('container').appendChild(txt_APIKey);
  document.getElementById('container').appendChild(btn_SaveAPIKey);
});



//tester code for the API
//tester code for the API
//tester code for the API




// tester code for background.js
btn_Connect.addEventListener('click', function() {
  document.getElementById('container').innerHTML = '';


  // below is code for background
  //chrome.runtime.onInstalled.addListener(() => {
  //  chrome.webNavigation.onCompleted.addListener(getVirusTotalResponse, {url: [{schemes: ['http', 'https']}]});
  //});
});


