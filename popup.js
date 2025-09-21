'use strict';

// Ask for a second click before opening more tabs than this.
const CONFIRM_THRESHOLD = 20;

const linksInput = document.getElementById('links');
const openButton = document.getElementById('openLink');
const defaultButtonText = openButton.textContent;
let pendingConfirm = false;

openButton.addEventListener('click', openTabs);
linksInput.addEventListener('input', resetConfirm);

// Turn one line of input into a URL to open:
//   https://example.com  -> as is (http/https only)
//   example.com/page     -> https://example.com/page
//   anything else        -> Google search for the line
function toUrl(line) {
  try {
    const url = new URL(line);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.href;
    }
  } catch (e) {
    // Not an absolute URL; fall through.
  }

  // Bare domain: no spaces, and a host part ending in a dot plus a 2+ letter TLD.
  if (!/\s/.test(line) && /^[^/?#:]+\.[a-z]{2,}(?=$|[/?#:])/i.test(line)) {
    try {
      return new URL('https://' + line).href;
    } catch (e) {
      // Fall through to search.
    }
  }

  return 'https://www.google.com/search?q=' + encodeURIComponent(line);
}

function resetConfirm() {
  pendingConfirm = false;
  openButton.textContent = defaultButtonText;
}

async function openTabs() {
  const urls = linksInput.value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map(toUrl);

  if (urls.length === 0) {
    return;
  }

  if (urls.length > CONFIRM_THRESHOLD && !pendingConfirm) {
    pendingConfirm = true;
    openButton.textContent = `Open ${urls.length} tabs? Click again`;
    return;
  }
  resetConfirm();

  // Open everything in the background first so the popup stays alive until
  // every tab is created, then switch to the first one (which closes the popup).
  const tabs = await Promise.all(
    urls.map((url) => chrome.tabs.create({ url, active: false }))
  );
  chrome.tabs.update(tabs[0].id, { active: true });
}
