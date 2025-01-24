import "../libs/browser-polyfill.js";

browser.commands.onCommand.addListener(async (command) => {
  if (command === "focus-searchbox") {
    console.log("keybind pressed");

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        method: "focusInput",
        urlTable: storage.urlTable,
      });
    });
  }
});
