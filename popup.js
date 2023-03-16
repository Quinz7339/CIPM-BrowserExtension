console.log("Start");

//declaration of variables and fixed strings
const feeds = [
    { title: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
    { title: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' }
  ];

var API_KEY = "Your API Key";
chrome.storage.sync.get(['API_KEY'], function(result) {
  API_KEY = result.API_KEY;
  });

// Gets the reference to the buttons and fields from the HTML document
const btn_News = document.getElementById('btn_News');
const btn_Tips = document.getElementById('btn_Tips');
const btn_Settings = document.getElementById('btn_Settings');


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

  const header = document.createElement('h2');
  header.innerText = "Settings";

  const title = document.createElement('h3');
  title.innerText = "Insert the API key for the VirusTotal malicious link detection.";
  
  const txt_APIKey = document.createElement('input');
  txt_APIKey.type = "text";
  txt_APIKey.id = "txt_APIKey";
  txt_APIKey.placeholder = "Insert API Key";

  chrome.storage.sync.get(['API_KEY'], function(result) {
    if (result.API_KEY != null || result.API_KEY != undefined) {
      txt_APIKey.value = result.API_KEY;
    }});

  const btn_SaveAPIKey = document.createElement('button');
  btn_SaveAPIKey.id = "btn_SaveAPIKey";
  btn_SaveAPIKey.innerText = "Save";
  btn_SaveAPIKey.disabled = true;
  btn_SaveAPIKey.title = "API Key must be 64 characters long";
  btn_SaveAPIKey.style.backgroundColor = "grey";

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

  btn_SaveAPIKey.addEventListener('click', function(){
    API_KEY = document.getElementById('txt_APIKey').value;
    setAPIKey();
  });

  document.getElementById('container').appendChild(header);
  document.getElementById('container').appendChild(title);
  document.getElementById('container').appendChild(txt_APIKey);
  document.getElementById('container').appendChild(btn_SaveAPIKey);
 
});

function setAPIKey() {
  chrome.storage.sync.set({API_KEY: API_KEY}, function() {
    console.log('Entered value is: ' + API_KEY);
  });
}

function doSomething() {
  console.log("Hello");
}



