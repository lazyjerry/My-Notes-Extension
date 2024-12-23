## **為什麼要開發這個擴充套件？**

在當今的社群網路環境中，使用者常因觀點不合而選擇封鎖其他帳號，這種做法雖能暫時避免衝突，但也同時削弱了資訊來源的多樣性。此外，網路上存在許多假冒帳號或有組織的網軍，他們散播極端言論或不實資訊，對社群氛圍造成負面影響。

**My Notes Extension** 的開發宗旨在於提供一個理性且具建設性的方式來管理和標記這些帳號。透過添加備註，使用者可以：

1. **保持資訊多樣性**  
   避免因封鎖而失去接觸不同觀點和訊息的機會，促進更多元的資訊攝取。

2. **提高警覺性**  
   對於疑似假帳號或有害內容的帳號進行標記，提醒自己在互動時保持警覺。

3. **個人化管理**  
   根據自身需求，自主決定哪些帳號需要特別關注或避免。

---

## **功能特色**

1. **自動偵測平臺帳號與頻道**  
   在 Facebook / Instagram / YouTube / Threads 等平臺頁面，為使用者名稱或頻道頁面加入「備註」輸入框，讓你能隨時紀錄、查看、編輯筆記。

2. **匯出與匯入 JSON**  
   - 在 Popup 中可一鍵匯出所有備註為 JSON 檔案。  
   - 匯入功能支援快速恢復資料，可實現多瀏覽器間的同步或重裝後的快速搬移。

3. **搜尋功能**  
   支援格式化的搜尋功能（如：`FB｜user123`），可快速定位目標帳號的備註資料。

4. **Threads 平臺支援**  
   - 可偵測 Threads（`threads.net`）的個人頁面網址，並對該使用者新增備註。  
   - 若無法取得 URL，則需透過分享個人檔案的方式取得正確的連結。

---

## **安裝方式**

1. **手動安裝**  
   - 下載整個專案資料夾，進入 `chrome://extensions/`。  
   - 開啟「開發者模式」，點擊「載入未封裝項目」，選擇資料夾即可安裝。

2. **Chrome Web Store**  
   - 點擊以下連結前往 Chrome Web Store：  
     [**點擊這裡安裝 My Notes Extension**](https://chrome.google.com/webstore/detail/my-notes-extension/njnkpkkcpcfdjjgminnlkfmjegjpojoe)

---

## **常見問題 (FAQ)**

### **1. 為什麼看不到備註欄位？**
- 確認您正在瀏覽 Facebook、Instagram、YouTube 或 Threads 的個人頁面或頻道頁面。  
- 如果社交平臺的結構改變，可能需要更新擴充套件以恢復正常功能。  

### **2. 備註有字數限制嗎？**
- 是的，單條備註的字數限制為 **100 字元**。

### **3. 如何匯出或匯入備註？**
- 匯出：在 Popup 中點擊「匯出 JSON」，系統會自動下載 JSON 檔案。  
- 匯入：將備註 JSON 檔案內容貼入匯入欄位，點擊「匯入 JSON」即可。

### **4. 我的備註會存在哪裡？**
- 備註資料存儲於瀏覽器的 `chrome.storage.local`，僅保留在本機端。

### **5. 如何在多台電腦同步備註？**
- 使用匯出功能將備註存成 JSON 檔案，然後在另一台電腦上使用匯入功能即可完成同步。

---

## **Threads 網頁版注意事項**

Threads 平臺的桌面版本通常不會顯示用戶個人頁面的正式 URL。若想正常使用擴充功能，需取得 `https://www.threads.net/@username` 格式的連結。例如：  
`https://www.threads.net/@使用者帳號`。

---

## **聯繫我們**

如果在使用過程中有任何問題或建議，請透過以下方式聯繫我們：

- **GitHub Issues**：[提交問題或回報](https://github.com/lazyjerry/My-Notes-Extension/issues)  
- **Email**：service@crazyjerry.studio  

---

## **授權條款**

本專案採用 **Apache License 2.0** 授權條款。感謝您的支持！

---

### **更新內容**

- 此版本更新於 2024 年 12 月 25 日，詳情請參閱 [changeLog.md](https://github.com/lazyjerry/My-Notes-Extension/blob/main/changeLog.md)。