console.log("Start");

//declaration of variables and fixed strings
const feeds = [
    { title: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
    { title: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' }
  ];

var API_KEY = "Your API Key";



// Gets the reference to the buttons from the HTML document
const btn_News = document.getElementById('btn_News');
const btn_Tips = document.getElementById('btn_Tips');

btn_News.addEventListener('click', function() {

    //Clearing the content of the divs
    document.getElementById('dark-reading-feed-container').innerHTML = '';
    document.getElementById('the-hacker-news-feed-container').innerHTML = '';


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

              //can consider using if else
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

btn_Tips.addEventListener('click', function() {


});