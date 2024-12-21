// popup.js

document.addEventListener("DOMContentLoaded", () => {

  // === DOM 元素參照 ===
  const messageDiv = document.getElementById("myExt_message");
  const noteSection = document.getElementById("myExt_noteSection");
  const noteInput = document.getElementById("myExt_noteInput");
  const charCount = document.getElementById("myExt_charCount");
  const saveBtn = document.getElementById("myExt_saveBtn");
  const lastUpdatedDiv = document.getElementById("myExt_lastUpdated");

  const exportBtn = document.getElementById("myExt_exportBtn");
  const importBtn = document.getElementById("myExt_importBtn");
  const jsonOutput = document.getElementById("myExt_jsonOutput");
  const jsonInput = document.getElementById("myExt_jsonInput");

  if (noteInput && charCount) {
    noteInput.addEventListener("input", () => {
      const maxLength = parseInt(noteInput.getAttribute("maxlength"), 10);
      const currentLength = noteInput.value.length;
      const remaining = maxLength - currentLength;
      charCount.textContent = `${remaining} / ${maxLength}`;
    });
  }

  // 用於分頁切換
  const tabMenu = document.getElementById("myExt_tabMenu");
  const tabs = tabMenu.querySelectorAll("li");
  const tabContents = document.querySelectorAll(".myExt_tabContent");

  // === 變數 ===
  let originalNote = ""; // 用於比對「文字是否修改」
  let userId = null; // 目前頁面的用戶 ID

  //「刷新」按鈕點擊，再一次呼叫 sendManualRefresh
  const refreshBtn = document.getElementById("myExt_refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      sendManualRefresh();
      triggerButtonAnimation(refreshBtn);
    });
  }

  function init() {
    // 讀取 contentScript 存的 currentUrl
    chrome.storage.local.get("currentUrl", (data) => {
      const urlText = data.currentUrl || "（尚未偵測到頁面）";
      const currentUrlEl = document.getElementById("myExt_currentUrlText");
      if (currentUrlEl) {
        currentUrlEl.textContent = urlText;
      }
    });

    // -----------------------------------------
    // 取得 currentUserId，並載入現有備註
    // -----------------------------------------
    chrome.storage.local.get("currentUserId", (data) => {
      userId = data.currentUserId;
      if (!userId) {
        // 如果沒有 currentUserId，代表目前不是個人/頻道頁面
        messageDiv.textContent = "目前非個人頁面";
        noteSection.style.display = "none";
        return;
      }

      // 如果是個人頁面，就顯示備註編輯區
      noteSection.style.display = "block";
      messageDiv.textContent = `目前頁面ID：${userId}`;

      // 從 storage 讀取此 userId 的備註 & 更新時間
      const keys = [userId, userId + "_updatedAt"];
      chrome.storage.local.get(keys, (res) => {
        // 載入備註內容
        if (res[userId]) {
          originalNote = res[userId];
          noteInput.value = originalNote;
        }

        // 載入最後更新時間
        if (res[userId + "_updatedAt"]) {
          let lastTime = new Date(res[userId + "_updatedAt"]);
          lastUpdatedDiv.textContent = "最後變更時間: " + formatDateTime(lastTime);
        } else {
          lastUpdatedDiv.textContent = "尚未有更新紀錄";
        }
      });
    });
  }

  // --------------------------------------------------
  // 監聽備註輸入變化，控制「儲存」按鈕啟用/停用
  // --------------------------------------------------
  noteInput.addEventListener("input", () => {
    const currentText = noteInput.value.trim();
    if (currentText !== originalNote.trim()) {
      enableSaveBtn(true); // 打開按鈕
    } else {
      enableSaveBtn(false); // 關閉按鈕
    }
  });

  // -------------------------
  // 儲存備註按鈕功能
  // -------------------------
  saveBtn.addEventListener("click", () => {
    if (!userId) return; // 若 userId 不存在（理論上不會進來）

    const newNote = noteInput.value.trim();
    const now = new Date();

    triggerButtonAnimation(saveBtn);

    // 將新的備註與更新時間存入 storage
    chrome.storage.local.set({
      [userId]: newNote,
      [userId + "_updatedAt"]: now.toISOString()
    }, () => {
      // 成功後：
      // 1) 更新 originalNote
      originalNote = newNote;
      // 2) 把按鈕設回「不可點擊」狀態
      enableSaveBtn(false);
      // 3) 顯示最後更新時間
      lastUpdatedDiv.textContent = "最後變更時間: " + formatDateTime(now);
    });
  });

  // -------------------------
  // 匯出 JSON
  // -------------------------
  exportBtn.addEventListener("click", () => {

    triggerButtonAnimation(exportBtn);
    chrome.storage.local.get(null, (items) => {
      // 將所有資料轉為 JSON 字串
      const jsonString = JSON.stringify(items, null, 2);

      // 產生一個 Blob 物件
      const blob = new Blob([jsonString], { type: "application/json" });
      // 建立 Blob URL
      const url = URL.createObjectURL(blob);

      // 動態建立 <a>，並觸發下載
      const link = document.createElement("a");
      link.href = url;
      link.download = `MY-NOTE-BACKUP_${Date.now()}.json`;
      // 檔名可自訂，例如 myNotesBackup_1666666666666.json

      // 觸發點擊後，移除連結
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 釋放 Blob URL
      URL.revokeObjectURL(url);
    });
  });

  // -------------------------
  // 匯入 JSON
  // -------------------------
  importBtn.addEventListener("click", () => {
    triggerButtonAnimation(importBtn);

    const importData = jsonInput.value.trim();
    if (!importData) {
      alert("請先在上方貼上 JSON 資料，再嘗試匯入。");
      return;
    }
    try {
      const obj = JSON.parse(importData);
      // 將 JSON 內容寫入 local storage（同名 key 會被覆蓋）
      chrome.storage.local.set(obj, () => {
        // 清空輸入框，提示完成
        jsonInput.value = "";
        alert("匯入成功！請重新整理或切換頁面以更新顯示。");
      });
    } catch (e) {
      alert("JSON 格式錯誤，請檢查後重新嘗試。\n錯誤資訊: " + e);
    }
  });

  // ------------------------------------------------
  // 初始化 Tab 切換（預設顯示「備註」分頁）
  // ------------------------------------------------
  initTabs();

  // === 小工具：啟用或停用「儲存」按鈕 ===
  function enableSaveBtn(isEnabled) {
    if (isEnabled) {
      saveBtn.classList.remove("disabled");
    } else {
      saveBtn.classList.add("disabled");
    }
  }

  // === 分頁切換功能 ===
  function initTabs() {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        // 移除所有 tab 與 content 的 active
        tabs.forEach(t => t.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        // 找到此 tab 對應的 data-tab
        const targetId = tab.getAttribute("data-tab");
        const targetContent = document.getElementById(targetId);

        // 為當前 tab 與對應 content 加上 active
        tab.classList.add("active");
        targetContent.classList.add("active");
      });
    });
  }

  /**
   * 封裝一個函式：向當前分頁的 content script 發送 {type: "MANUAL_REFRESH"} 訊息
   */
  function sendManualRefresh() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "MANUAL_REFRESH" }, (response) => {
          if (chrome.runtime.lastError) {
            // 代表沒找到接收方 (content script)
            console.warn("onActivated: Could not refresh:", chrome.runtime.lastError.message || "Unknown error");
            // 這裡可顯示提示或忽略
            // 在這裡顯示給使用者：當前分頁不支援或沒有注入 content script
            lastUpdatedDiv.textContent = "目前頁面無法偵測到備註功能，可能不在支援網域或無法注入內容。" + (chrome.runtime.lastError.message || "Unknown error");
          } else {
            console.log("Manual refresh done. Response =", response);
            init();
          }
        });
      }
    });
  }

  function injectContentScript() {
    // 取得當前分頁
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;

      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["contentScript.js"] // 這裡放 contentScript.js 的檔名或路徑
        },
        () => {
          // 注入成功後可執行後續邏輯
          console.log("contentScript.js 已動態注入。");
          sendManualRefresh();
        }
      );
    });
  }


  injectContentScript();

});

/**
 * 封裝函式：觸發按鈕的動畫效果
 * @param {HTMLElement} button - 要觸發動畫的按鈕元素
 */
function triggerButtonAnimation(button) {
  // 移除之前的動畫類別（如果有的話）
  button.classList.remove("animate-rotate");

  // 選擇要使用的動畫類別，這裡以 rotate 為例
  // 如果想要使用 shake，將 'animate-rotate' 換成 'animate-shake'
  button.classList.add("animate-rotate");

  // 監聽動畫結束事件，移除動畫類別以便下次觸發
  button.addEventListener("animationend", () => {
    button.classList.remove("animate-rotate");
    // 若使用 shake 動畫，請同時移除 'animate-shake'
    // button.classList.remove("animate-shake");
  }, { once: true }); // 只執行一次
}

// === 小工具：格式化日期 ===
function formatDateTime(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const hh = String(dateObj.getHours()).padStart(2, "0");
  const ii = String(dateObj.getMinutes()).padStart(2, "0");
  const ss = String(dateObj.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
}

/*
|  _____ _     _       _           _
| |_   _| |__ (_)___  (_)___      | | ___ _ __ _ __ _   _
|   | | | '_ \| / __| | / __|  _  | |/ _ \ '__| '__| | | |
|   | | | | | | \__ \ | \__ \ | |_| |  __/ |  | |  | |_| |_
|   |_| |_| |_|_|___/ |_|___/  \___/ \___|_|  |_|   \__, (_)
|                                                   |___/
 */