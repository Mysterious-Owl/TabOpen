'use strict';

let openLink = document.getElementById('openLink');
let links = document.getElementById('links')
var all_links;

openLink.onclick = function () {
  open_tabs();
};

function open_tabs() {
  var data = links.innerText.split('\n');
  if (length(data) == 0) {
    return;
  }
  for (var i = 0; i < data.length; i++) {
    chrome.tabs.create({
      url: links_array[i]
    });
  }
};

// function connect() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const port = chrome.tabs.connect(tabs[0].id);
//     port.postMessage({ function: 'get_links' });
//     port.onMessage.addListener((links_array) => {
//         if (links_array.length == 0) {
//             openLink.innerHTML = "No links";
//             openLink.disabled = true;
//             openLink.style.color = 'gray';
//             document.getElementById('icon').style.display = "none";
//         }
//         else {
//             openLink.innerHTML = 'Open ' + links_array.length + ' Tabs';
//         }
//         all_links = links_array;
//     });
//   });
// }

// window.addEventListener('load', (event) => {
//   chrome.tabs.executeScript(null, {
//     file: 'content_script.js' }, () => {
//       connect();
//   });
// });