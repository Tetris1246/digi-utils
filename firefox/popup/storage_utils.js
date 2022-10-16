function onError(error) {
    console.error(error);
}

function getDefaultSettings(callback) {
    browser.runtime.sendMessage({"getDefaultObject": {}}).then(function(message) {
        callback(message.response);
    }, onError);
}

function getStorage(callback) {
    browser.storage.local.get().then(function (message) {
        callback(message);
    }, onError);
}

function setStorage(object) {
    browser.storage.local.set(object);
}

function addSettingChangeListener(func) {
    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if ("settingChange" in request) {
            func();
            sendResponse({response: {}});
        }
        return true;
    });
}

function settingsChanged() {
    browser.runtime.sendMessage({"settingChange": {}});
}

function getSettingState(setting, callFunction) {
    browser.runtime.sendMessage({"getSettingState": {"setting": setting}}).then(function(message) {
        if (message.response === true) callFunction();
    }, function(e){console.error(e)});
}

function getSettingInputValue(setting, input, callFunction) {
    browser.runtime.sendMessage({"getSettingInputValue": {"setting": setting, "input": input}}).then(function(message) {
        callFunction(message);
    }, function(e){console.error(e)});
}