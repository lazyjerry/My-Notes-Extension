# My Notes Extension 社群標籤

為 Facebook / Instagram / YouTube / Threads 帳號（或頻道、粉專）增設備註欄，作為該用戶的標籤用途，並提供「匯出 / 匯入 JSON」功能，可在同一台或多台電腦之間輕鬆同步備註資料。

---

## 功能特色

1. **在 FB / IG / YT / Threads 網頁中自動偵測**  
   - 為用戶名稱或頻道頁面加入「備註」欄位，讓你能隨時紀錄、查看、編輯筆記。

2. **匯出與匯入 JSON**  
   - 在 Popup 中點擊按鈕，即可將所有備註以 JSON 格式輸出。  
   - 也可將 JSON 貼入匯入欄位，一鍵實現多瀏覽器或重裝後的快速搬移。

3. **搜尋功能**  
   - 支援格式化的搜尋功能，可輸入指定的平臺前綴與帳號名稱進行精準查詢。  
   - 適用於多個平臺，讓你快速定位目標帳號的備註資料。

---

## 安裝方式

1. **手動安裝**  
   - 下載整個專案，並到 `chrome://extensions/` 開啟「開發者模式」。  
   - 點擊「載入未封裝項目」，選擇專案資料夾即可啟用。

2. **Chrome 線上應用程式商店**  
   - 點擊以下連結前往 Chrome 線上應用程式商店：  
     [**點擊這裡前往安裝**](https://chromewebstore.google.com/detail/my-notes-extension/njnkpkkcpcfdjjgminnlkfmjegjpojoe?authuser=0&hl=zh-TW) 

---

## 使用教學

1. **安裝完成後**  
   - 建議將本擴充套件釘選到瀏覽器工具列，方便隨時使用。

2. **新增或修改備註**  
   - 前往 Facebook / Instagram / YouTube / Threads 的任意使用者 / 頻道 / 個人檔案頁面。  
   - 偵測到頁面後，系統會自動在**使用者名稱旁**顯示一個「備註輸入框」。  
   - 輸入文字後點擊儲存按鈕，保存內容。

3. **匯出 / 匯入**  
   - 點擊右上角的擴充套件圖示 → 選擇 **My Notes Extension** → 匯出所有備註為 JSON，或將 JSON 貼入匯入欄位恢復資料。

4. **搜尋功能**  
   - 選擇平臺並輸入帳號名稱（如：`FB｜user123` 或 `Threads｜@example`），點擊搜尋按鈕，即可查看該帳號的備註。

---

## Threads 網頁版使用說明

Threads（`threads.net`）的官方網頁功能有限，通常**不會顯示用戶個人檔案的正式網址**。若想正常使用備註功能，需取得 `@username` 格式的個人檔案 URL，例如：  
`https://www.threads.net/@使用者帳號`。  
- 若無法取得該格式連結，則無法偵測到該使用者。  
- 一旦 URL 符合要求，擴充套件即可正常運作，插入備註欄位。

---

## 專案結構

myNotesExtension/  
├── manifest.json  
├── background.js  
├── contentScript.js  
├── popup.html  
├── model.js  
├── controller.js  
└── icons/  
    ├── icon16.png  
    ├── icon48.png  
    └── icon128.png  

- **manifest.json**：Chrome Extension 設定檔（Manifest V3）  
- **contentScript.js**：在網頁上插入備註欄位，並偵測 URL 變化  
- **popup.html / model.js / controller.js**：彈出視窗 UI，實作匯出 / 匯入 JSON 與手動刷新功能  
- **background.js**：背景執行服務，監聽擴充功能事件  

---

## 開發者注意

1. **Threads 平臺**  
   Threads 在桌面版瀏覽器運作不穩，該官方網頁主要用於分享連結或行動瀏覽器跳轉。若用戶想要使用備註功能，需確保獲取 `@username` 格式的個人檔案 URL。

2. **平臺變更**  
   Facebook、Instagram、YouTube 等平臺可能頻繁改動，請定期檢查 `contentScript.js` 的 selector 是否仍能正常插入備註欄。

---

## 版權與條款

- 本專案採用 Apache License 2.0 授權條款。  
- 若有任何問題或建議，歡迎於 Issue 中交流或直接聯繫作者。

---

感謝你使用 **My Notes Extension**！如有進一步使用上的疑問，請於 Issue 中回報或透過聯繫方式向我們提出建議！
