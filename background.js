// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// When the browser action is clicked, `addToClipboard()` will use an offscreen
// document to write the value of `textToCopy` to the system clipboard.
chrome.action.onClicked.addListener(async () => {
  await addToClipboard(textToCopy);
});

chrome.contextMenus.create({
  id: "sayitbetter",
  title: "Say it better!",
  contexts:["selection"],
});

async function getConfiguration() {
  return new Promise((resolve) => {
    chrome.storage.local.get('config', (data) => {
      resolve(data.config);
    });
  });
}

chrome.contextMenus.onClicked.addListener(async function(clickData, tab){

  if (clickData.menuItemId == "sayitbetter" && clickData.selectionText){
    chrome.tabs.sendMessage(tab.id, {
      action: 'createDiv',
      text: "Asking to ChatGPT, please wait..."
    });

    const tone = await getConfiguration() || "plain";
    console.error(tone);

    const url = "https://say-it-better.vercel.app/api/query";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({tone: tone, prompt: clickData.selectionText}),
    });

    const body = await res.text();

    addToClipboard(body);

    chrome.tabs.sendMessage(tab.id, {
      action: 'updateDiv',
      text: "Copied to the clipboard."
    });

  }
});


// Solution 1 - As of Jan 2023, service workers cannot directly interact with
// the system clipboard using either `navigator.clipboard` or
// `document.execCommand()`. To work around this, we'll create an offscreen
// document and pass it the data we want to write to the clipboard.
async function addToClipboard(value) {
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'Write text to the clipboard.'
  });

  // Now that we have an offscreen document, we can dispatch the
  // message.
  chrome.runtime.sendMessage({
    type: 'copy-data-to-clipboard',
    target: 'offscreen-doc',
    data: value
  });
}

// Solution 2 – Once extension service workers can use the Clipboard API,
// replace the offscreen document based implementation with something like this.
// async function addToClipboardV2(value) {
//   navigator.clipboard.writeText(value);
// }
