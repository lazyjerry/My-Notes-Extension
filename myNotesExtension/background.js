chrome.runtime.onInstalled.addListener(() => {
  console.log("My Notes Extension 已安裝");
});

// 如需與 content script 溝通，可使用以下方式：
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === "test") {
//     console.log("接收到 content script 的訊息");
//     sendResponse({ success: true });
//   }
// });