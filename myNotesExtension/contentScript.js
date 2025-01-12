// contentScript.js

(function() {

  function onUrlChange() {
    let url = window.location.href;
    console.log("onUrlChange()", url);
    let userId = parseUserId(url);

    // 存下當前 URL
    chrome.storage.local.set({ currentUrl: url });

    if (userId) {
      console.log("偵測到用戶ID:", userId);
      chrome.storage.local.set({ currentUserId: userId });
    } else {
      chrome.storage.local.remove("currentUserId");
    }
  }

  // === 核心：parseUserId 函式 ===
  function parseUserId(urlString) {
    try {
      let u = new URL(urlString);

      // ------- Facebook --------
      if (u.hostname.includes("facebook.com")) {
        let fbId = parseFacebook(u);
        if (fbId) {
          return "FB｜" + fbId;
        }
      }
      // ------- Instagram -------
      else if (u.hostname.includes("instagram.com")) {
        let igId = parseInstagramByUrl(u);
        if (igId) return "IG｜" + igId;

        // 如果是特殊網頁
        if (false !== igId) {
          // 若 URL 不一定準，則進一步偵測「og:type=profile」
          let ogProfileId = detectInstagramProfileByMeta();
          if (ogProfileId) return "IG｜" + ogProfileId;
        }
      }
      // ------- YouTube --------
      else if (u.hostname.includes("youtube.com")) {
        let ytId = parseYouTube(u);
        if (ytId) {
          return "YT｜" + ytId;
        }
      } // ------- Threads --------
      else if (u.hostname.includes("threads.net")) {
        let threadsId = parseThreads(u);
        if (threadsId) {
          return "Threads｜" + threadsId;
        }
      }
    } catch (e) {
      console.warn("URL parsing error:", e);
    }
    return null;
  }

  // === 針對 FB 網址解析 ===
  function parseFacebook(u) {
    if (u.pathname.startsWith("/profile.php")) {
      let id = u.searchParams.get("id");
      if (id) return id;
    }
    if (u.pathname.startsWith("/groups/")) {
      let parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 4 && parts[2] === "user") {
        return parts[3];
      } else if (parts.length >= 2) {
        return parts[1];
      }
    }
    // 其他： /{username}
    let pathParts = u.pathname.split("/").filter(Boolean);
    if (pathParts.length === 1) {
      return pathParts[0];
    }
    return null;
  }

  // === 針對 IG 先用 URL 判斷 ===
  function parseInstagramByUrl(u) {
    // /{username}，排除 /direct, /explore, /accounts 等系統路徑
    if (u.pathname.length > 1) {
      let igName = u.pathname.split("/")[1];
      if (igName && igName.length > 0 &&
        igName !== 'direct' &&
        igName !== 'explore' &&
        igName !== 'accounts') {
        return igName;
      }
    }

    if (igName !== 'direct' &&
      igName !== 'explore' &&
      igName !== 'accounts') {
      return false;
    }

    return null;
  }

  // === 進一步偵測 IG 的 <meta property="og:type" content="profile"> ===
  function detectInstagramProfileByMeta() {
    let metaOgType = document.querySelector('meta[property="og:type"]');
    if (metaOgType && metaOgType.content === "profile") {
      console.log("[IG Profile] og:type=profile detected.");
      let metaOgTitle = document.querySelector('meta[property="og:title"]');
      if (metaOgTitle && metaOgTitle.content) {
        return metaOgTitle.content.trim();
      }
      return "unknown_ig_profile";
    }
    return null;
  }

  // === 針對 Threads 網址解析 (新增) ===
  function parseThreads(u) {
    // 例如：
    // https://www.threads.net/@lion.ifbbpro?igshid=NTc4MTIwNjQ2YQ==
    // https://www.threads.net/@wonfulovesyou
    // https://www.threads.net/@ikicks0777
    //
    // pathname => "/@lion.ifbbpro" (或 "/@wonfulovesyou", "/@ikicks0777")
    // 只要檢查第一個 pathPart 是否以 "@" 開頭，是則去掉 "@"
    let parts = u.pathname.split("/").filter(Boolean);
    if (parts.length === 1 && parts[0].startsWith("@")) {
      // 去掉 "@" 後回傳
      return parts[0].substring(1);
    }
    return null;
  }

  // === 針對 YouTube 網址作更細解析 ===
  function parseYouTube(u) {
    // 例子：
    // https://www.youtube.com/@napalmrecords
    // https://www.youtube.com/@ptstaigitai
    // https://www.youtube.com/@user-xv4he4mt4x
    // https://www.youtube.com/c/{xxx}
    // https://www.youtube.com/channel/UCxxxxx
    // 如果第一個 pathPart 是 "@xxxx"，那我們就提取後面的 "xxxx"

    let pathParts = u.pathname.split("/").filter(Boolean);
    if (pathParts.length === 0) {
      return null;
    }

    if(pathParts[0] === "watch"){
      return null;
    }

    // 1) 偵測 @xxxx
    if (pathParts[0].startsWith("@")) {
      // e.g. "@napalmrecords"
      //你也可以去掉 "@" 再回傳：
      return pathParts[0].substring(1);
    }

    // 2) 若不是 @，就把它們連成 "_"
    // 例如 /channel/UCxxxxx => "channel_UCxxxxx"
    // /c/xxx => "c_xxx"
    // ...
    return pathParts.join("_");
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "MANUAL_REFRESH") {
      console.log("[contentScript] 收到手動刷新訊息，執行 onUrlChange()");
      onUrlChange(); // 呼叫你原本的 onUrlChange() 函式
      sendResponse({ done: true });
    }
  });

  // 呼叫一次更新，讓 popup 打開時更新一次
  onUrlChange();

})();

/*
|  _____ _     _       _           _
| |_   _| |__ (_)___  (_)___      | | ___ _ __ _ __ _   _
|   | | | '_ \| / __| | / __|  _  | |/ _ \ '__| '__| | | |
|   | | | | | | \__ \ | \__ \ | |_| |  __/ |  | |  | |_| |_
|   |_| |_| |_|_|___/ |_|___/  \___/ \___|_|  |_|   \__, (_)
|                                                   |___/
 */