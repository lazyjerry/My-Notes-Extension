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


// 願這個世界人形蟑螂不復存在；願這台灣社會能夠產生強大的資訊抗體；
// 願台灣公民能夠擁有建全的健康的公民素養與多元舒適的媒體環境。

/*
|  _____ _     _       _           _
| |_   _| |__ (_)___  (_)___      | | ___ _ __ _ __ _   _
|   | | | '_ \| / __| | / __|  _  | |/ _ \ '__| '__| | | |
|   | | | | | | \__ \ | \__ \ | |_| |  __/ |  | |  | |_| |_
|   |_| |_| |_|_|___/ |_|___/  \___/ \___|_|  |_|   \__, (_)
|                                                   |___/
 */