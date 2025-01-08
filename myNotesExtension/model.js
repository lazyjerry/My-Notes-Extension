// 遠端存取功能
const RemoteStorage = {
    apiUrl: '', // 遠端 API URL
    apiKey: '', // API 金鑰

    init: function (url, key) {
        this.apiUrl = url;
        this.apiKey = key;
    },
    isWorking: function () {
        return this.apiUrl && this.apiKey && '' !== this.apiUrl;
    },

    parseJsonString: function (input) {
    try {
        // 檢查是否為有效的 JSON 字串
        const parsed = JSON.parse(input);

        // 如果解析成功，返回解析後的結果
        return parsed;
    } catch (error) {
        // 如果解析失敗，直接返回原始字串
        return input;
    }
},

    request: function (action, payload, callback, errorCallback) {
        let body = JSON.stringify({action, ...payload});
        console.log(body);
        fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'jerry-auth': this.apiKey,
            },
            body: body,
            mode: 'cors' // 確保模式為 cors
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("response", data);
                if (data.isSuccess) {
                    let result = this.parseJsonString(data.result);
                    callback(result || {});
                } else {
                    errorCallback(data.result || '');
                }
            })
            .catch((error) => {
                console.log(error);
                errorCallback(error.message || 'Network error occurred.');
            });
    },

    // 讀取資料
    read: function (key, callback, errorCallback) {
        console.log("RemoteStorage", "read");
        this.request('read', {key}, callback, errorCallback);
    },

    // 新增或更新資料
    put: function (key, content, callback, errorCallback) {
        console.log("RemoteStorage", "put");
        this.request('put', {key, content}, callback, errorCallback);
    },

    // 刪除資料
    delete: function (key, callback, errorCallback) {
        console.log("RemoteStorage", "delete");
        this.request('delete', {key}, callback, errorCallback);
    },
};


const Model = {

    formatDateTime: function (dateObj) {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const hh = String(dateObj.getHours()).padStart(2, "0");
        const ii = String(dateObj.getMinutes()).padStart(2, "0");
        const ss = String(dateObj.getSeconds()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`;
    },

    // 獲取當前 URL
    getCurrentUrl: function (callback) {
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
    getUserData: function (callback) {
        chrome.storage.local.get(["currentUserId"], (data) => {
            const userId = data.currentUserId;

            if (!userId) {
                console.warn("No currentUserId found in storage.");
                callback(null);
                return;
            }

            this.getNote(userId, (userNoteData) => {
                console.log(userNoteData);
                if(userNoteData) {
                    callback({
                        userId,
                        note: userNoteData.note || "",
                        updatedAt: userNoteData.updatedAt || null,
                    });
                }else{
                    callback({
                        userId,
                        note:  "",
                        updatedAt:  null,
                    });
                }
            });
        });
    },

    readIndex: function (userId, systemData, callback) {
        let noteIndex = {};
        if (RemoteStorage.isWorking()) {
            const key = "noteIndex";
            RemoteStorage.read(key, function (data) {
                noteIndex = data.noteIndex || {};
                // 更新或新增 noteIndex 的資料
                noteIndex[userId] = {...systemData};
                callback(noteIndex);
            }, function (err) {
                noteIndex = {};
                noteIndex[userId] = {...systemData};
                callback(noteIndex);
            });
        } else {
            // 更新 noteIndex 並保存備註
            chrome.storage.local.get("noteIndex", (data) => {
                noteIndex = data.noteIndex || {};
                // 更新或新增 noteIndex 的資料
                noteIndex[userId] = {...systemData};
                callback(noteIndex);
            });
        }
    },
    // 儲存備註
    saveNote: function (userId, note, systemData, callback) {

        this.readIndex(userId, systemData, function (noteIndex) {
            const now = new Date().toISOString();
            if (RemoteStorage.isWorking()) {
                // 存兩次，一次是 noteIndex
                RemoteStorage.put("noteIndex", JSON.stringify(noteIndex), function (data) {
                    console.log(`userId 資料儲存成功`);
                    // 儲存完 noteIndex 存 userId
                    const key = userId;
                    const content = JSON.stringify({note, updatedAt: now});
                    RemoteStorage.put(key, content, function (data) {
                        console.log(`Note saved for userId: ${userId}`);
                        callback();
                    }, function (err) {
                        console.warn(`userId 資料儲存錯誤`);
                    });

                }, function (err) {
                    console.warn(`noteIndex 資料儲存錯誤`);
                });
            } else {
                // 同時存儲備註內容
                let content = {
                    noteIndex,
                    [userId]: {note, updatedAt: now},
                };
                chrome.storage.local.set(content,
                    () => {
                        console.log(`Note saved for userId: ${userId}`);
                        // console.log(content);
                        callback();
                    }
                );
            }
        });
    },

    // 匯出備註
    exportNotes: function (callback) {
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
    importNotes: function (importData, callback, errorCallback) {
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

            chrome.storage.local.set({...storageData, noteIndex}, () => {
                console.log("Notes imported successfully.");
                callback();
            });
        } catch (error) {
            errorCallback(error);
        }
    },

    // 獲取資料
    getNote: function (userId, callback) {
        if (RemoteStorage.isWorking()) {
            let key = userId;
            RemoteStorage.read(key, function (data) {
                callback(data);
            }, function (err) {
                callback('');
            });
        } else {
            chrome.storage.local.get(userId, (data) => {
                if (data) {
                    callback(data[userId]);
                } else {
                    console.warn(`No note found for userId: ${userId}`);
                    callback('');
                }
            });
        }
    },

    // 搜尋備註
    searchNotes: function (query, callback, errorCallback) {
        if (!query.includes("｜")) {
            errorCallback("Invalid query format. Expected format: '平台前綴｜帳號名稱'.");
            errorCallback(`格式錯誤: ${query}`);
            return;
        }

        this.getNote(query, function(data){
            console.log(data);
            if(data){
                callback({
                    userId: query,
                    note: data.note || "",
                    updatedAt: data.updatedAt || null,
                });
            }else{
                console.log(`No data found for query: ${query}`);
                errorCallback(`查詢不到資料: ${query}`);
            }
        })
        //
        // chrome.storage.local.get(query, (items) => {
        //     if (items[query]) {
        //         // 匹配成功，返回 note
        //         callback({
        //             userId: query,
        //             note: items[query].note || "",
        //             updatedAt: items[query].updatedAt || null,
        //         });
        //     } else {
        //         // 匹配失敗
        //         console.log(`No data found for query: ${query}`);
        //         errorCallback(`查詢不到資料: ${query}`);
        //     }
        // });
    },

    /**
     * 發送訊息到 Content Script
     * @param {Object} message - 要發送的訊息物件
     * @param {Function} callback - 接收回應的回調函數
     */
    sendMessageToContentScript: function (message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
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