# My Notes Extension

為 Facebook / Instagram / YouTube / Threads 帳號（或頻道、粉專、個人頁面）**增設備註欄**，並提供「匯出 / 匯入 JSON」功能，可在同一台或多台電腦之間輕鬆同步備註資料。

## 為什麼要開發這個擴充套件？

在當今的社群網路環境中，使用者常因觀點不合而選擇封鎖其他帳號，這種做法雖能暫時避免衝突，但也同時削弱了資訊來源的多樣性和豐富性。此外，網路上存在許多假冒帳號或有組織的網軍，他們散播極端言論、仇恨言論或偶像崇拜思想，對社群氛圍造成負面影響。

**My Notes Extension** 的開發宗旨在於提供一個更理性且具建設性的方式來管理和標記這些帳號。透過為特定帳號添加備註，使用者可以：

1. **保持資訊多樣性**：避免因封鎖而失去接觸不同觀點和訊息的機會，促進更全面的資訊攝取。
2. **提高警覺性**：對於疑似假帳號或有害內容的帳號進行標記，提醒自己在互動時保持警覺，避免被誤導或受害。
3. **個人化管理**：根據自身需求和偏好，自主決定哪些帳號需要特別關注或避免，增強社群互動的質量。

透過這個擴充套件，使用者能夠更有效地管理社群網路中的人際關係和資訊流，既不失去多元觀點的來源，又能保護自己免受有害內容的影響。

## 功能特色

1. **在 FB / IG / YT / Threads 網頁中自動偵測**  
   - 為使用者名稱旁邊或頻道名稱旁邊，加入「備註」輸入框，可即時編輯並自動保存。
2. **匯出與匯入 JSON**  
   - 在 Popup 內可一鍵匯出所有備註為 JSON，並可在其他瀏覽器或重裝後快速匯入。
3. **支援單頁式應用**  
   - 透過覆蓋 `history.pushState` / `replaceState` 與 `MutationObserver` 雙管齊下，偵測 SPA URL 變化。
4. **Threads 支援**  
   - 能解析 Threads（`threads.net/@username`）個人頁面網址；但請注意官方網頁版無法正常列出用戶個人頁面，多半需「分享個人檔案」連結才能取得。

## 安裝方式

1. **尚未上架前（開發者模式安裝）**  
   - 下載整個專案資料夾，進入 `chrome://extensions/`  
   - 開啟「開發者模式」，點擊「載入未封裝項目 (Load unpacked)」，選擇此專案資料夾即可。  
2. **Chrome Web Store 連結 (待上架)**  
   - [**點此前往安裝**](https://chrome.google.com/webstore/detail/TODO) ← 上架後請改為實際連結

## 使用教學

1. 安裝後，開啟任一 **Facebook / Instagram / YouTube / Threads** 個人頁面或頻道頁面。  
2. 當網頁偵測到目標用戶（或頻道）時，會在名稱旁出現「備註」輸入框。  
3. 任何文字在輸入後即自動存至 `chrome.storage.local`，下次造訪同個頁面會顯示先前筆記。  
4. 進入瀏覽器右上角的擴充功能列，點擊 **My Notes Extension** → 在彈出視窗可進行「匯出 JSON / 匯入 JSON」等進階操作。

## Threads 網頁版提醒

- Threads 官方主要為行動應用程式，桌面版 `threads.net` 頁面通常不會直接顯示個人檔案的 URL。  
- 若要使用本擴充功能的備註功能，需要能取得形如 `https://www.threads.net/@username` 的連結（例如由他人分享、或特別的測試環境），才能正常插入備註欄位。

## 常見問題 (FAQ)

### 1. 如何安裝這個外掛？

**回答：**

- **從 Chrome Web Store 安裝：**
  1. 前往 [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)。
  2. 搜尋「My Notes Extension」。
  3. 點擊「加入至 Chrome」按鈕，並按照提示完成安裝。

- **手動載入未封裝項目：**
  1. 下載並解壓縮外掛的原始程式碼檔案。
  2. 打開 Chrome 瀏覽器，輸入 `chrome://extensions/` 並按下 Enter。
  3. 開啟右上角的「開發者模式」。
  4. 點擊「載入已解壓的擴充功能」，選擇外掛的資料夾。
  5. 外掛將會被安裝並顯示在擴充功能列表中。

### 2. 外掛支援哪些網站？

**回答：**

**My Notes Extension** 目前支援以下社交媒體平台的個人頁面或頻道頁面：

- **Facebook**
- **Instagram**
- **YouTube**
- **Threads**

請確保您正在瀏覽的是這些平台的個人檔案頁面或頻道頁面，以便外掛能夠正確偵測並顯示備註欄位。

### 3. 如何添加備註？

**回答：**

1. 前往支援的網站（如 Facebook、Instagram、YouTube 或 Threads）的個人頁面或頻道頁面。
2. 點擊瀏覽器工具列中的 **My Notes Extension** 圖示，打開外掛的 popup。
3. 在 popup 中，您會看到一個 **「備註」** 的輸入框。
4. 輸入您對該用戶或頻道的備註，字數限制為 **100 字元**。
5. 輸入完成後，點擊 **「儲存備註」** 按鈕，備註將會自動保存。

### 4. 備註有字數限制嗎？

**回答：**

是的，備註的字數限制為 **100 字元**。當您在備註輸入框中輸入文字時，底下會顯示剩餘的字元數，幫助您控制輸入的長度。

### 5. 如何匯出和匯入備註？

**回答：**

#### 匯出備註

1. 打開 **My Notes Extension** 的 popup。
2. 切換到 **「匯入／匯出」** 分頁。
3. 點擊 **「匯出 JSON」** 按鈕，將會下載一個包含所有備註資料的 `.json` 檔案到您的電腦。

#### 匯入備註

1. 打開 **My Notes Extension** 的 popup。
2. 切換到 **「匯入／匯出」** 分頁。
3. 在 **「匯入 JSON」** 的文字區塊中，貼上您之前匯出的 `.json` 檔案內容。
4. 點擊 **「匯入 JSON」** 按鈕，備註資料將會被導入到外掛中。

**注意事項：**

- 匯入前建議先備份現有的備註資料，以免意外覆蓋。
- 匯入的 JSON 格式必須與匯出時的格式一致。

### 6. 資料是如何儲存的？

**回答：**

**My Notes Extension** 使用 `chrome.storage.local` 來儲存您的備註資料。這意味著您的備註資料僅儲存在本機電腦上，不會自動同步到其他裝置。如果您在多台電腦上使用此外掛，請使用匯出和匯入功能來同步您的備註資料。

### 7. 當外掛更新時，資料會被刪除嗎？

**回答：**

不會。只要外掛的 **Extension ID** 保持不變，並且您是以正常的更新方式（例如透過 Chrome Web Store 或手動重新載入未封裝項目）進行升級，儲存在 `chrome.storage.local` 中的備註資料將會被保留。只有在以下情況下，資料可能會被清除：

1. **移除並重新安裝外掛**：如果您在 Chrome 的「擴充功能」頁面中移除了外掛並重新安裝，之前的備註資料將會被清除。
2. **更改 Extension ID**：若在開發過程中意外更改了外掛的 Extension ID，Chrome 會視其為新的外掛，導致舊的儲存資料無法被讀取。
3. **使用者手動清空資料**：使用者可以透過 Chrome 的設定或開發者工具手動清除 `chrome.storage` 中的資料。
4. **程式碼改用其他儲存機制**：如改用 `indexedDB` 或其他方式存取資料，且未進行相容處理，可能導致舊資料無法被讀取。

### 8. 為什麼在某些網站上無法看到備註欄位？

**回答：**

有幾種可能的原因：

1. **不支援的網域**：請確認您正在瀏覽的是 Facebook、Instagram、YouTube 或 Threads 的個人頁面或頻道頁面。如果不在這些網站上，外掛將不會顯示備註欄位。
2. **網頁結構變動**：社交媒體平台可能會不定期更新其網站的 DOM 結構，導致外掛無法正確偵測和注入備註欄位。您可以嘗試手動刷新外掛或等待更新。
3. **外掛未正確載入**：請確認外掛已經正確安裝並啟用。您可以在 `chrome://extensions/` 檢查外掛的狀態。
4. **特定分頁限制**：某些特殊的分頁（如 `chrome://` 開頭的頁面）無法注入 content script，因此外掛無法在這些分頁上運作。

### 9. 外掛的匯入匯出功能如何保護我的資料安全？

**回答：**

**My Notes Extension** 的匯入匯出功能僅在您的本機電腦上運行，不會將您的備註資料上傳到任何雲端服務或第三方伺服器。當您匯出備註時，資料會以 JSON 格式下載到您的電腦；匯入時，您需要手動選擇並導入之前匯出的 JSON 檔案。因此，請妥善保管您的匯出檔案，以防資料洩露。

### 10. 如果我有問題或建議，該怎麼聯繫你們？

**回答：**

若您在使用 **My Notes Extension** 時遇到任何問題或有建議，歡迎透過以下方式聯繫我們：

📧 **電子郵件**： [service@crazyjerry.studio](mailto:service@crazyjerry.studio)

我們將盡快回覆您的訊息，感謝您的支持與使用！

---

## 授權聲明

本專案採用 **Apache License 2.0** 授權條款。
