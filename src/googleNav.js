browser.runtime.onMessage.addListener((request) => {
  console.log("msg received");
  if (request.method === "clickCard") {
    let cards = Array.from(document.querySelectorAll(".MjjYud"));
    let href = cards[request.index].querySelector("a").href;

    browser.runtime.sendMessage({ method: "openTab", url: href });
  }
});
