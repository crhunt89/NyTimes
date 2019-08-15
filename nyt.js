
let baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
let key = 'S0iwMsrXcgsXcoHQY6IEPYMcGX7NmMMU';
let url;
// All the variables I'll manipulate

let searchTerm = document.querySelector('.search');
let startDate = document.querySelector('.start-date');
let endDate = document.querySelector('.end-date');
let searchForm = document.querySelector('form');
let submitBtn = document.querySelector('.submit');
let nextBtn = document.querySelector('.next');
let previousBtn = document.querySelector('.prev');
let section = document.querySelector('section');
let nav = document.querySelector('nav');
nav.style.display = 'none';
let pageNumber = 0;
let displayNav = false;

// Event listeners 

searchForm.addEventListener('submit', submitSearch);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function submitSearch(e){
  pageNumber = 0;
  fetchResults(e);
}
function fetchResults(e) {
//  preventDefault() stops the form from submitting 
  e.preventDefault();
  
  // Research  what ?api &page &q &fq=   are
  url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value + '&fq=document_type:("article")';
  if(startDate.value !== '') {
    url += '&begin_date=' + startDate.value;
  };
  if(endDate.value !== '') {
    url += '&end_date=' + endDate.value;
  };
  // fetch() makes the request to the url
  fetch(url).then(function(result) {
    return result.json();
  }).then(function(json) {
    displayResults(json);
  });
}
function displayResults(json) {
  while (section.firstChild) {
      section.removeChild(section.firstChild);// the while loop will clear out any articles before new search results are added
  }
  let articles = json.response.docs; //where i'm storing the data that function is storing
  
  // Start Showing Results Make ifElse statement
  if(articles.length === 10) {
    nav.style.display = 'block'; //shows the nav display if 10 items are in the array
  } else {
    nav.style.display = 'none'; //hides the nav display if < 10 items are in the array 
  }
  if(articles.length === 0) {
    let para = document.createElement('p');
    para.textContent = 'No results returned.'
    section.appendChild(para);
  } else {
    for(let i = 0; i < articles.length; i++) {
      // DOM manipulation
      let article = document.createElement('article'); // create node in the DOM article element
      let heading = document.createElement('h2'); // creating node in DOM that has h2 element
      let link = document.createElement('a'); // allows the creation of href
      let img = document.createElement('img');//creating img element
      let para1 = document.createElement('p');//declaring a paragraph variable
      let para2 = document.createElement('p');
      let clearfix = document.createElement('div');//declaring clearfix variable appending to div
      let current = articles[i]; //holds the data of the current article as I iterate
      console.log(current);
      link.href = current.web_url; //attaching href, current grabs hyperlink in current article, sets value each time it iterates
      link.textContent = current.headline.main;
      para1.textContent = current.snippet;
      para2.textContent = 'Keywords: ';//each result will show Keywords at start of p tag created by para
     
     //Nested loop iterating through the length of the array for the current result object
      for(let j = 0; j < current.keywords.length; j++) {
        // creating a <span> for each keyword
        let span = document.createElement('span');
        // text for each <span> will be the value found inside the keywords array
        span.textContent = current.keywords[j].value + ' ';
        // appending each <span> to para2 node
        para2.appendChild(span);
      }
      //conditional to check the JSON data
      if(current.multimedia.length > 0) {
        //if there is an object I want to concatenate a string with the url
        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        //alt image in case image isn't available
        img.alt = current.headline.main;
      }
      //targeting clearfix class in CSS
      clearfix.setAttribute('class','clearfix'); 
      article.appendChild(heading); //h2 element inside each article element
      heading.appendChild(link); //making link the heading child for each h2
      article.appendChild(img);
      article.appendChild(para1);
      article.appendChild(para2);
      article.appendChild(clearfix);
      section.appendChild(article); //article is now the child of section and h2 is the grandchild of section
    }
  }
};
function nextPage(e) {
  pageNumber++; //increasing value by 1
  fetchResults(e);//re-run the function
};
function previousPage(e) {
  if(pageNumber > 0) { // accounting that user is on first page
    pageNumber--; // decrease by 1
  } else {
    return; //value = 0 return nothing
  }
  fetchResults(e); //re-run the function
};