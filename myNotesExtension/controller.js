// controller.js

document.addEventListener("DOMContentLoaded", function() {
  // === DOM 元素參照 ===
  const messageDiv = document.getElementById("myExt_message");
  const noteSection = document.getElementById("myExt_noteSection");
  const noteInput = document.getElementById("myExt_noteInput");
  const charCount = document.getElementById("myExt_charCount");
  const saveBtn = document.getElementById("myExt_saveBtn");
  const lastUpdatedDiv = document.getElementById("myExt_lastUpdated");

  const exportBtn = document.getElementById("myExt_exportBtn");
  const importBtn = document.getElementById("myExt_importBtn");
  const jsonInput = document.getElementById("myExt_jsonInput");

  const searchInput = document.getElementById("myExt_searchInput");
  const searchBtn = document.getElementById("myExt_searchBtn");
  const searchResultsDiv = document.getElementById("myExt_searchResults");

  const tabs = document.querySelectorAll("#myExt_tabMenu li");
  const tabContents = document.querySelectorAll(".myExt_tabContent");

  let originalNote = "";
  let userId = null;

  // 初始化
  function init() {
    Model.getCurrentUrl((url) => {
      document.getElementById("myExt_currentUrlText").textContent = url;
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
  }

  // 儲存備註
  saveBtn.addEventListener("click", function() {
    if (!userId) return;
    const newNote = noteInput.value.trim();
    Model.saveNote(userId, newNote, function(now) {
      originalNote = newNote;
      saveBtn.classList.add("disabled");
      lastUpdatedDiv.textContent = `最後變更時間: ${Model.formatDateTime(new Date(now))}`;
    });
  });

  // 匯出備註
  exportBtn.addEventListener("click", function() {
    Model.exportNotes(function(jsonData) {
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `MY-NOTE-BACKUP_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    });
  });

  // 匯入備註
  importBtn.addEventListener("click", function() {
    const jsonData = jsonInput.value.trim();
    if (!jsonData) {
      alert("請先貼上 JSON 資料");
      return;
    }

    Model.importNotes(
      jsonData,
      function() {
        alert("匯入成功！");
      },
      function(e) {
        alert("JSON 格式錯誤：" + e.message);
      }
    );
  });

  // 搜尋備註
  searchBtn.addEventListener("click", function() {
    const query = searchInput.value.trim();
    if (!query) {
      searchResultsDiv.innerHTML = "<p style='color: red;'>請輸入關鍵字。</p>";
      return;
    }

    Model.searchNotes(query, function(results) {
      searchResultsDiv.innerHTML = results.length ?
        results.map(([key, value]) => `<div><strong>${key}</strong>: ${value}</div>`).join("") :
        "<p>未找到結果。</p>";
    });
  });

  // 初始化分頁
  tabs.forEach(function(tab, index) {
    tab.addEventListener("click", function() {
      tabs.forEach(function(t) {
        t.classList.remove("active");
      });
      tabContents.forEach(function(c) {
        c.classList.remove("active");
      });
      tab.classList.add("active");
      tabContents[index].classList.add("active");
    });
  });

  // 初始化
  init();
});