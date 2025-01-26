import "../libs/browser-polyfill.js";

browser.commands.onCommand.addListener(async (command) => {
  if (command === "focus-searchbox") {
    console.log("keybind pressed");

    browser.storage.sync.get("urlTable").then((storage) => {
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
  console.log(request);
  if (request.method === "updateUrlTable") {
    console.log(request);
    updateUrlTable(request);
  } else if (request.method === "getUrlTable") {
    console.log("fetching url table");
    sendUrlTable(sendResponse);
    return true;
  }
});

function sendUrlTable(sendResponse) {
  browser.storage.sync
    .get("urlTable")
    .then((storage) => sendResponse({ urlTable: storage.urlTable || {} }));
}

function updateUrlTable(request) {
  if (Number.isInteger(request.pressCount)) {
    browser.storage.sync.get("urlTable").then((storage) => {
      let newUrlTable = storage["urlTable"] || {};
      newUrlTable[request.urlBase] = request.pressCount;
      browser.storage.sync.set({ urlTable: newUrlTable });
      console.log(
        "urlTable updated for, ",
        request.urlBase,
        ": ",
        request.pressCount
      );
    });
  }
}
