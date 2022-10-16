function getDefaultSettings(callback) {
    chrome.runtime.sendMessage({"getDefaultObject": {}}, function(message) {
        callback(message.response);
    });
}

function getStorage(callback) {
    chrome.storage.local.get(function (message) {
        callback(message);
    });
}

function setStorage(object) {
    chrome.storage.local.set(object);
}

function addSettingChangeListener(func) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if ("settingChange" in request) {
            func();
            sendResponse({response: {}});
        }
        return true;
    });
}

function settingsChanged() {
    chrome.runtime.sendMessage({"settingChange": {}});
}