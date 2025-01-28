import "../libs/browser-polyfill.js";

browser.commands.onCommand.addListener(async (command) => {
  if (command === "focus-searchbox") {
    browser.storage.local.get("urlTable").then((storage) => {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
          method: "focusInput",
          urlTable: storage.urlTable,
        });
      });
    });
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === "updateUrlTable") {
    updateUrlTable(request);
  } else if (request.method === "getUrlTable") {
    sendUrlTable(sendResponse);
    return true;
  }
});

function sendUrlTable(sendResponse) {
  browser.storage.local
    .get("urlTable")
    .then((storage) => sendResponse({ urlTable: storage.urlTable || {} }));
}

function updateUrlTable(request) {
  if (Number.isInteger(request.pressCount)) {
    browser.storage.local.get("urlTable").then((storage) => {
      let newUrlTable = storage["urlTable"] || {};
      newUrlTable[request.urlBase] = request.pressCount;
      browser.storage.local.set({ urlTable: newUrlTable });
    });
  }
}
