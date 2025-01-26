let lastPress = Date.now() - 3000;
let pressCount;

browser.runtime.sendMessage({ method: "getUrlTable" }).then((response) => {
  let urlTable = response.urlTable;

  browser.runtime.onMessage.addListener((request) => {
    if (request.method === "focusInput") {
      let inputBoxArray = document.querySelectorAll("input");

      if (inputBoxArray) {
        let nFields = inputBoxArray.length;
        let urlBase = getUrlBase();
        let sinceLastPress = Date.now() - lastPress;
        let isInUrlTable = Object.keys(urlTable).includes(urlBase);

        if (sinceLastPress > 3000) {
          if (isInUrlTable) {
            pressCount = urlTable[urlBase];
            focusElement(inputBoxArray[pressCount]);
          } else {
            pressCount = 0;
            focusElement(inputBoxArray[pressCount]);
          }
        } else {
          pressCount++;
          let inputOrder = pressCount % nFields;
          focusElement(inputBoxArray[inputOrder]);
          storePressCount(inputOrder);
        }

        lastPress = Date.now();
      }
    }
  });
});

function storePressCount(pressCount) {
  let urlBase = getUrlBase();

  browser.runtime.sendMessage({
    method: "updateUrlTable",
    urlBase,
    pressCount,
  });
}

function getUrlBase() {
  let currentUrl = window.location.href;
  let urlSplit = currentUrl.split(".");
  let urlBase;

  if (urlSplit.length === 1) return "";

  if (currentUrl.includes("www")) {
    urlBase = urlSplit[1];
  } else {
    let remainder = urlSplit[0];
    if (remainder.includes("//")) {
      urlBase = remainder.split("//").slice(-1)[0];
    } else {
      urlBase = urlSplit[0];
    }
  }

  return urlBase;
}

function focusElement(element) {
  try {
    if (element && typeof element.focus === "function") {
      element.focus();
    }
  } catch (error) {}
}
