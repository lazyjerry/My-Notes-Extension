document.addEventListener("DOMContentLoaded", function () {
    const messageDiv = document.getElementById("myExt_message");
    const noteSection = document.getElementById("myExt_noteSection");
    const noteInput = document.getElementById("myExt_noteInput");
    const charCount = document.getElementById("myExt_charCount");
    const saveBtn = document.getElementById("myExt_saveBtn");
    const lastUpdatedDiv = document.getElementById("myExt_lastUpdated");

    const refreshBtn = document.getElementById("myExt_refreshBtn");

    const exportBtn = document.getElementById("myExt_exportBtn");
    const importBtn = document.getElementById("myExt_importBtn");
    const jsonInput = document.getElementById("myExt_jsonInput");

    const platformSelect = document.getElementById("myExt_platformSelect");
    const searchInput = document.getElementById("myExt_searchInput");
    const searchBtn = document.getElementById("myExt_searchBtn");
    const searchResultsDiv = document.getElementById("myExt_searchResults");

    const tabs = document.querySelectorAll("#myExt_tabMenu .tab");
    const tabContents = document.querySelectorAll(".tab-content");

    const statusBar = document.getElementById("myExt_currentUrlText");

    const storageTypeSelect = document.getElementById("myExt_storageType");
    const apiKeyInput = document.getElementById("myExt_apiKey");
    const serviceUrlInput = document.getElementById("myExt_serviceUrl");
    const saveSettingsBtn =document.getElementById("saveSettingsBtn");


    let originalNote = "";
    let userId = null;

    function triggerButtonShake(button) {
        if (!button || button.classList.contains("disabled")) {
            // 如果按鈕為空或具有 disabled 類名，則不執行
            return;
        }

        // 添加晃動樣式
        button.classList.add("animate-rotate");

        // 在動畫結束後移除晃動樣式
        button.addEventListener(
            "animationend",
            () => {
                button.classList.remove("animate-rotate");
            },
            { once: true } // 確保只執行一次
        );
    }

    function initRemoteStorageAndUpdateUI(storageType, apiKey,serviceUrl){
        if (storageType === "remote" && '' !== serviceUrl ) {
            RemoteStorage.init(serviceUrl, apiKey);
            exportBtn.classList.add("disabled");
            importBtn.classList.add("disabled");
            jsonInput.placeholder = "遠端模式下，無法使用匯入匯出功能";
            storageTypeSelect.value = storageType;
            apiKeyInput.value = apiKey;
            serviceUrlInput.value = serviceUrl;
        } else {
            exportBtn.classList.remove("disabled");
            importBtn.classList.remove("disabled");
            jsonInput.placeholder = "在此貼上 JSON，再按下方按鈕匯入";
            RemoteStorage.init('', '');
            if (storageType === "remote") {
                chrome.storage.local.set("storageType", "local");
                storageTypeSelect.value = "local";
            }
            storageTypeSelect.value = storageType;
        }

    }

    // 動態注入 contentScript.js
    function injectContentScript(callback) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (!tabs[0]) {
                console.warn("No active tab found.");
                return;
            }

            // 初始化存取方式
            chrome.storage.local.get(["storageType", "apiKey", "serviceUrl"], (settings) => {
                const {storageType = "local", apiKey = "", serviceUrl = ""} = settings;
                initRemoteStorageAndUpdateUI(storageType,apiKey,serviceUrl);
            });

            chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    files: ["contentScript.js"],
                },
                () => {
                    console.log("Content script injected.");
                    if (callback) callback();
                }
            );
        });
    }

    // 儲存設定按鈕邏輯
    saveSettingsBtn.addEventListener("click", () => {

        triggerButtonShake(saveSettingsBtn);
        let storageType = storageTypeSelect.value;
        const apiKey = apiKeyInput.value.trim();
        const serviceUrl = serviceUrlInput.value.trim();

        if (storageType === "remote" && (!apiKey || !serviceUrl)) {

            alert("請輸入有效的 API 金鑰和服務 URL！");
            storageType = "local";
            chrome.storage.local.set(
                {storageType},
                () => {
                    statusBar.textContent = "設定強制儲存成本機！";
                    initRemoteStorageAndUpdateUI(storageType,'','');
                }
            );

            return;
        }

        chrome.storage.local.set(
            {storageType, apiKey, serviceUrl},
            () => {
                if (storageType === "remote") {
                    initRemoteStorageAndUpdateUI(storageType,apiKey,serviceUrl);
                } else {
                    (storageType,'','');
                }
                statusBar.textContent = "設定已儲存！";

            }
        );
    });

    // 更新字數計算和啟用保存按鈕
    noteInput.addEventListener("input", function () {
        const maxLength = parseInt(noteInput.getAttribute("maxlength"), 10);
        const currentLength = noteInput.value.length;
        const remaining = maxLength - currentLength;

        // 更新字數顯示
        charCount.textContent = `${remaining} / ${maxLength}`;

        // 啟用保存按鈕
        if (noteInput.value.trim() !== originalNote.trim()) {
            saveBtn.classList.remove("disabled");
        } else {
            saveBtn.classList.add("disabled");
        }
    });

    // 儲存備註
    saveBtn.addEventListener("click", function () {
        triggerButtonShake(saveBtn);
        if (!userId) return;
        const newNote = noteInput.value.trim();
        const systemData = {updatedAt: Model.formatDateTime(new Date())};

        Model.saveNote(userId, newNote, systemData, function (now) {
            originalNote = newNote;
            saveBtn.classList.add("disabled");
            lastUpdatedDiv.textContent = `最後變更時間: ${systemData.updatedAt}`;
        });
    });


    // 匯出備註
    exportBtn.addEventListener("click", function () {
        triggerButtonShake(exportBtn);
        Model.exportNotes(function (exportData) {
            if (!exportData) {
                alert("No notes to export.");
                return;
            }

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], {type: "application/json"});
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `MY-NOTE-BACKUP_${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
        });
    });


    // 匯入備註
    importBtn.addEventListener("click", function () {
        triggerButtonShake(importBtn);
        const jsonData = jsonInput.value.trim();
        if (!jsonData) {
            alert("請先貼上 JSON 資料");
            return;
        }

        Model.importNotes(
            jsonData,
            function () {
                alert("匯入成功！");
            },
            function (e) {
                alert("JSON 格式錯誤：" + e.message);
            }
        );
    });

    searchBtn.addEventListener("click", function () {
        triggerButtonShake(searchBtn);
        const query = searchInput.value.trim();
        const platform = platformSelect.value;

        if (!query) {
            searchResultsDiv.value = "請輸入關鍵字。";
            return;
        }

        const formattedQuery = `${platform}｜${query}`;

        Model.searchNotes(
            formattedQuery,
            function (result) {
                if (result) {
                    searchResultsDiv.value = `${result.userId}｜${result.updatedAt}\n ---- \n${result.note}`;
                    statusBar.textContent = "查詢成功";
                } else {
                    searchResultsDiv.value = "未找到結果。";
                }
            },
            function (error) {
                statusBar.textContent = error;
            }
        );
    });

    // 修復分頁切換邏輯
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {

            const targetTab = tab.getAttribute("data-tab");

            // 移除所有分頁的 active 標記
            tabs.forEach(function (t) {
                t.classList.remove("active");
            });

            // 隱藏所有分頁內容
            tabContents.forEach(function (content) {
                content.classList.remove("active");
            });

            // 為當前選中的分頁添加 active 標記
            tab.classList.add("active");

            // 顯示對應的分頁內容
            document.getElementById(targetTab).classList.add("active");
        });
    });

    // 手動刷新功能
    refreshBtn.addEventListener("click", function () {
        triggerButtonShake(refreshBtn);
        Model.sendMessageToContentScript({type: "MANUAL_REFRESH"}, (response, error) => {
            if (error) {
                messageDiv.textContent =
                    "目前頁面無法刷新，請確認是否支援注入內容腳本。";
            } else if (response && response.done) {
                console.log("Manual refresh successful.");
                init(); // 重新初始化數據
            }
        });
    });


    // 初始化
    function init() {
        injectContentScript(() => {

            Model.getCurrentUrl((url) => {
                statusBar.textContent = url;
            });

            Model.getUserData((userData) => {
                if (!userData) {
                    messageDiv.textContent = "目前非個人頁面";
                    noteSection.style.display = "none";
                    return;
                }

                userId = userData.userId;
                originalNote = userData.note;
                noteInput.value = originalNote;
                noteSection.style.display = "block";
                messageDiv.textContent = `目前頁面ID：${userId}`;

                if (userData.updatedAt) {
                    const lastTime = new Date(userData.updatedAt);
                    lastUpdatedDiv.textContent = `最後變更時間: ${Model.formatDateTime(lastTime)}`;
                } else {
                    lastUpdatedDiv.textContent = "尚未有更新紀錄";
                }
            });

        });
    }

    // 初始化
    init();
});

