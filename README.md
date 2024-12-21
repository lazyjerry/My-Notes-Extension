# My Notes Extension

為 Facebook / Instagram / YouTube / Threads 帳號（或頻道、粉專）**增設備註欄**，並提供「匯出 / 匯入 JSON」功能，可在同一台或多台電腦之間輕鬆同步備註資料。

## 功能特色

1. **在 FB / IG / YT / Threads 網頁中自動偵測**：  
   - 為用戶名稱或頻道名稱旁邊加入「備註」欄位，讓你能隨時紀錄、查看、編輯筆記。  
2. **支援 SPA 網站 (單頁應用) 的 URL 變化**：  
   - 透過覆蓋 `history.pushState` / `replaceState` 及 `MutationObserver` 同時偵測 URL 變化。 （已取消功能，改為 popup 時偵測） 
3. **匯出與匯入 JSON**：  
   - 只要在 Popup 內點擊匯出按鈕，即可將所有備註以 JSON 輸出。  
   - 也可貼上 JSON 一鍵匯入，實現多瀏覽器或重裝後快速搬移。  
4. **Threads 支援**：  
   - 解析 Threads（`threads.net`）個人頁面網址，讓你也能對該使用者建立備註。

## 安裝方式

- **尚未上架**：  
  - 你可以手動下載整個專案，並在 `chrome://extensions/` → 開啟「開發者模式」 → 點擊「載入未封裝項目」，選擇本專案資料夾。  
- **Chrome Web Store**：  
  - [**點擊這裡前往安裝**](https://chrome.google.com/webstore/detail/my-notes-extension/njnkpkkcpcfdjjgminnlkfmjegjpojoe)  ← 2024-12-21 提交審核，待上架後更新此連結 

## 使用教學

1. 安裝或載入本擴充功能後，**前往 Facebook / Instagram / YouTube / Threads** 的任意使用者 / 頻道 / 個人檔案頁面。  
2. 一旦偵測到該頁面，可以在**使用者名稱旁邊**看到一個「備註輸入框」。  
3. **輸入文字**後即自動儲存，使用者往後回到此頁時就能看到先前記下的內容。  
4. **匯出 / 匯入**：  
   - 點擊瀏覽器右上角的擴充功能圖示 → 選擇 **My Notes Extension** → 在 Popup 中可以匯出目前所有備註為 JSON；  
   - 也可將 JSON 貼進匯入欄位並一鍵恢復。

## Threads 網頁版使用說明

Threads（`threads.net`）在一般瀏覽中，通常**不會顯示用戶個人檔案的正式網址**；只有使用 **「分享個人檔案」** 連結方式，才能取得像 `https://www.threads.net/@使用者帳號` 的 URL。  
- 若沒辦法取得這種個人連結，則**無法偵測到**該使用者。  
- 一旦確定出現了 `threads.net/@username` 之類的網址後，本擴充功能就可正常插入備註欄位。

## 專案結構

```
myNotesExtension/
├── manifest.json
├── background.js
├── contentScript.js
├── popup.html
├── popup.js
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

- **manifest.json**：Chrome Extension 設定檔（Manifest V3）  
- **contentScript.js**：在網頁上插入備註欄位，並偵測 URL 變化  
- **popup.html / popup.js**：彈出視窗 UI，實作匯出 / 匯入 JSON 與手動刷新功能  
- **background.js**：背景執行服務，監聽擴充功能事件  

## 開發者注意

- Threads 在桌面版瀏覽器並不穩定，該官方網頁主要用於分享連結或行動瀏覽器跳轉，若用戶想要使用備註功能，需要能取得 `@username` 格式的個人檔案 URL。  
- Facebook、Instagram、YouTube 可能改動頻繁，需要定期檢查 `contentScript.js` 的 selector 是否仍能正常插入備註欄。  

## 版權與條款

- 本專案採用 Apache License 2.0 授權條款。  
- 若有任何問題或建議，歡迎於 Issue 交流或直接聯繫作者。

---

以上就是**My Notes Extension** 的簡易介紹與教學。若有進一步使用上的疑問，請在 Issues 或信件聯繫。感謝你的使用！