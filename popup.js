'use strict';

let openLink = document.getElementById('openLink');
let links = document.getElementById('links')
var all_links;

openLink.onclick = function () {
  open_tabs();
};

function open_tabs() {
  var data = links.value.split('\n');
  console.log(data);
  if (data.length == 0) {
    return;
  }
  
  for (var i = 0; i < data.length; i++) {
    data[i] = data[i].trim();
    if (data[i] == ""){
      continue;
    }
    if (data[i].slice(0,5) != 'https'){
      data[i] = 'https://www.google.com/search?q='+data[i]
      // data[i] = 'https://www.bing.com/search?q='+data[i]
    }
    chrome.tabs.create({
      url: data[i]
    });
  }
};
