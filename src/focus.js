let inputBox = document.querySelectorAll("input");

browser.runtime.onMessage.addListener((request) => {
  if (request.method === "focusInput") {
    if (inputBox) {
      inputBox[pressCount].focus();
    }
  }
});
