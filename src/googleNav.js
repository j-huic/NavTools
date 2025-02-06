browser.runtime.onMessage.addListener((request) => {
  console.log("msg received");
  if (request.method === "clickCard") {
    let cards = Array.from(document.querySelectorAll(".MjjYud a"));
    href = cards[request.index]?.href;

    browser.runtime.sendMessage({ method: "openTab", url: href });
  }
});
