const Model = {
  formatDateTime: function(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const ii = String(dateObj.getMinutes()).padStart(2, "0");
    const ss = String(dateObj.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
  },

  // 獲取當前 URL
  getCurrentUrl: function(callback) {
    chrome.storage.local.get("currentUrl", (data) => {
      if (data.currentUrl) {
        callback(data.currentUrl);
      } else {
        console.warn("currentUrl not found in storage.");
        callback("（尚未偵測到頁面）");
      }
    });
  },

  // 獲取當前 User ID 和其備註
  getUserData: function(callback) {
    chrome.storage.local.get(["currentUserId"], (data) => {
      const userId = data.currentUserId;

      if (!userId) {
        console.warn("No currentUserId found in storage.");
        callback(null);
        return;
      }

      chrome.storage.local.get(userId, (userNoteData) => {
        const noteData = userNoteData[userId] || {};

        callback({
          userId,
          note: noteData.note || "",
          updatedAt: noteData.updatedAt || null,
        });
      });
    });
  },

  // 儲存備註
  saveNote: function(userId, note, systemData, callback) {
    const now = new Date().toISOString();

    // 更新 noteIndex 並保存備註
    chrome.storage.local.get("noteIndex", (data) => {
      const noteIndex = data.noteIndex || {};

      // 更新或新增 noteIndex 的資料
      noteIndex[userId] = { ...systemData };

      // 同時存儲備註內容
      chrome.storage.local.set({
          noteIndex,
          [userId]: { note, updatedAt: now },
        },
        () => {
          console.log(`Note saved for userId: ${userId}`);
          callback();
        }
      );
    });
  },

  // 獲取資料
  getNote: function(userId, callback) {
    chrome.storage.local.get(userId, (data) => {
      if (data[userId]) {
        callback(data[userId]);
      } else {
        console.warn(`No note found for userId: ${userId}`);
        callback(null);
      }
    });
  },

  // 匯出備註
  exportNotes: function(callback) {
    chrome.storage.local.get("noteIndex", (data) => {
      const noteIndex = data.noteIndex || {};
      const userIds = Object.keys(noteIndex);

      if (userIds.length === 0) {
        callback(null, "No notes to export.");
        return;
      }

      let user = notes[userId] || "";
      if (user) {
        chrome.storage.local.get(userIds, (notes) => {
          const exportData = userIds.map((userId, index) => ({
            index: index + 1, // 行數
            userId,
            note: user.note || "",
            updatedAt: user.updatedAt || "",
            systemData: noteIndex[userId] || {},
          }));

          callback(exportData, null);
        });
      }
    });
  },

  // 匯入備註
  importNotes: function(importData, callback, errorCallback) {
    try {
      const parsedData = JSON.parse(importData);
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid format: Expected an array.");
      }

      const noteIndex = {};
      const storageData = {};

      parsedData.forEach((entry) => {
        if (!entry.userId || !entry.note) {
          throw new Error("Invalid entry: Missing userId or note.");
        }

        noteIndex[entry.userId] = {
          ...entry.systemData,
        };

        storageData[entry.userId] = {
          note: entry.note,
          updatedAt: entry.updatedAt || new Date().toISOString(),
        };
      });

      chrome.storage.local.set({ ...storageData, noteIndex }, () => {
        console.log("Notes imported successfully.");
        callback();
      });
    } catch (error) {
      errorCallback(error);
    }
  },

  // 搜尋備註
  searchNotes: function(query, callback, errorCallback) {
    if (!query.includes("｜")) {
      errorCallback("Invalid query format. Expected format: '平台前綴｜帳號名稱'.");
      errorCallback(`格式錯誤: ${query}`);
      return;
    }

    chrome.storage.local.get(query, (items) => {
      if (items[query]) {
        // 匹配成功，返回 note
        callback({
          userId: query,
          note: items[query].note || "",
          updatedAt: items[query].updatedAt || null,
        });
      } else {
        // 匹配失敗
        console.log(`No data found for query: ${query}`);
        errorCallback(`查詢不到資料: ${query}`);
      }
    });
  },

  /**
   * 發送訊息到 Content Script
   * @param {Object} message - 要發送的訊息物件
   * @param {Function} callback - 接收回應的回調函數
   */
  sendMessageToContentScript: function(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        console.warn("No active tab found.");
        callback(null, new Error("No active tab found."));
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Message send error: ", chrome.runtime.lastError.message);
          callback(null, chrome.runtime.lastError);
        } else {
          callback(response, null);
        }
      });
    });
  },
};