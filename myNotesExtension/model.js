// model.js

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
      callback(data.currentUrl || "（尚未偵測到頁面）");
    });
  },

  // 獲取當前 User ID 和其備註
  getUserData: function(callback) {
    chrome.storage.local.get("currentUserId", (data) => {
      const userId = data.currentUserId;
      if (!userId) {
        callback(null);
        return;
      }

      const keys = [userId, `${userId}_updatedAt`];
      chrome.storage.local.get(keys, (res) => {
        callback({
          userId,
          note: res[userId] || "",
          updatedAt: res[`${userId}_updatedAt`] || null,
        });
      });
    });
  },

  // 更新備註
  saveNote: function(userId, note, callback) {
    const now = new Date().toISOString();
    chrome.storage.local.set({
        [userId]: note, [`${userId}_updatedAt`]: now },
      () => callback(now)
    );
  },

  // 匯出所有備註
  exportNotes: function(callback) {
    chrome.storage.local.get(null, (items) => {
      callback(JSON.stringify(items, null, 2));
    });
  },

  // 匯入備註
  importNotes: function(jsonData, callback, errorCallback) {
    try {
      const obj = JSON.parse(jsonData);
      chrome.storage.local.set(obj, callback);
    } catch (e) {
      errorCallback(e);
    }
  },

  // 搜尋備註
  searchNotes: function(query, callback) {
    chrome.storage.local.get(null, (items) => {
      const results = Object.entries(items).filter(([key, value]) =>
        key.includes(query) || (value && value.includes(query))
      );
      callback(results);
    });
  },
};