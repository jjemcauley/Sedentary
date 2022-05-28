"use strict";

let windowId = null;
const storageKey = "windowKey";
chrome.storage.local.get([storageKey], (result) => {
  windowId = result.windowKey;
});

//Creates a popup window when called
const createPopupWindow = function () {
  chrome.windows.create(
    //Adobe XD sizing to Chrome sizing: height + 55, width + 24 (No scroll bar)
    { type: "popup", url: "popup.html", height: 735, width: 1064 },
    function (data) {
      windowId = data.id;
      chrome.storage.local.set({ [storageKey]: data.id });
    }
  );
};

//When the Sedentia Icon is clicked
chrome.action.onClicked.addListener(function () {
  if (windowId) {
    chrome.windows.update(windowId, { focused: true }).catch(() => {
      createPopupWindow();
    });
  } else {
    createPopupWindow();
  }
});

//When Popup window is closed, change value at the storage location back to null and reset windowId variable.
chrome.windows.onRemoved.addListener((rmved) => {
  chrome.storage.local.get([storageKey], (result) => {
    if (rmved === result[storageKey]) {
      chrome.action.setBadgeText({ text: "" });
      chrome.alarms.clearAll(); //Potential fix for Weird bug.
      windowId = null;
      chrome.storage.local.set({ [storageKey]: null });
    }
  });
});
