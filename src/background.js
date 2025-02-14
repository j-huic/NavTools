import "../libs/browser-polyfill.js";

browser.commands.onCommand.addListener(async (command) => {
  console.log(command);
  if (command === "focus-searchbox") {
    browser.storage.local.get("urlTable").then((storage) => {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs
          .sendMessage(tabs[0].id, {
            method: "focusInput",
            urlTable: storage.urlTable,
          })
          .catch(() => {});
      });
    });
  } else if (command.includes("click-card")) {
    console.log("msg out");
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs
        .sendMessage(tabs[0].id, {
          method: "clickCard",
          index: parseInt(command.slice(-1)) - 1,
        })
        .catch(() => {});
      console.log(command.slice(-1));
    });
  }
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === "updateUrlTable") {
    updateUrlTable(request);
  } else if (request.method === "getUrlTable") {
    sendUrlTable(sendResponse);
    return true;
  } else if (request.method === "openTab") {
    browser.tabs.create({ url: request.url });
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
