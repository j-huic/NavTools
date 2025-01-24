let inputBox = document.querySelectorAll("input");
let pressCount = 0;

browser.runtime.onMessage.addListener((request) => {
  if (request.method === "focusInput") {
    if (inputBox) {
      console.log("box found");
      console.log(inputBox[pressCount]);

      inputBox[pressCount].focus();
      pressCount++;
      storePressCount(pressCount);
    }
  }
});
