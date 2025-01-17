console.log("digi-utils> background.js loaded")

// check if settings are already stored, if not set defaults
var default_settings = {
    dark: {
        value: true,
        description: "Protects against blindness",
        title: "Dark Mode",
        inputs: {}
    },
    average: {
        value: true,
        description: "Displays the grade average in the evaluation tab",
        title: "Grade Average",
        inputs: {}
    },
    chart: {
        value: true,
        description: "Adds a grade chart to the evaluation tab",
        title: "Grade Chart",
        inputs: {}
    },
    antiafk: {
        value: true,
        description: "Prevents you from being logged out automatically",
        title: "Anti-AFK",
        inputs: {}
    },
    report: {
        value: true,
        description: "Displays the grade point average in the report card tab (only in the 2nd semester)",
        title: "Report card average",
        inputs: {}
    },
    login: {
        value: false,
        description: "Logs you in automatically (warning: the login data is stored unencrypted in the browser memory)",
        title: "Autologin",
        inputs: {
            only_click: {
                title: "Only Click (no auto fill in)",
                input: {
                    type: "checkbox",
                    value: "true"
                }
            },
            username: {
                title: "Username (not needed if only click is enabled)",
                input: {
                    type: "text",
                    value: ""
                }
            },
            password: {
                title: "Password (not needed if only click is enabled)",
                input: {
                    type: "password",
                    value: ""
                }
            }
        }
    },
    icons: {
        value: true,
        description: "Adds custom icons",
        title: "Custom Icons",
        inputs: {}
    },
    limitis_fix: {
        value: true,
        title: "Limitis Fix",
        description: "Replaces the Limitis icon in the login window with a high-resolution icon with an invisible background",
        inputs: {}
    },
    custom_href: {
        value: true,
        title: "Custom Href",
        description: "Adds a button in the popup to get to the register. You can change the link as you like. The default link leads to the register of RG-TFO, but other links work as well. (After entering, the browser must be restarted).",
        inputs: {
            href_url: {
                title: "Link to your register",
                input: {
                    type: "text",
                    value: "https://rgtfo-me.digitalesregister.it/v2/login"
                }
            }
        }
    }
}

function compareSettings(default_settings, storage_values) {
    for (let setting in default_settings) {
        if (storage_values.hasOwnProperty(setting)) {
            if (!storage_values[setting].hasOwnProperty("value")) {
                storage_values[setting].value = default_settings[setting].value;
            }
        } else {
            storage_values[setting] = {};
            storage_values[setting].value = default_settings[setting].value;
        }
        
        if (!storage_values[setting].hasOwnProperty("inputs")) {
            storage_values[setting].inputs = {};
        }

        for (let inputItem in default_settings[setting].inputs) {
            if (storage_values[setting]["inputs"].hasOwnProperty(inputItem)) {
                if (!storage_values[setting]["inputs"][inputItem].hasOwnProperty("value")) {
                    storage_values[setting]["inputs"][inputItem].value = default_settings[setting]["inputs"][inputItem]["input"].value;
                }
            } else {
                storage_values[setting]["inputs"][inputItem] = {};
                storage_values[setting]["inputs"][inputItem].value = default_settings[setting]["inputs"][inputItem]["input"].value;
            }
        }
        
    }
    return storage_values;
}

function checkStoredSettings(storedSettings) {
    if (storedSettings.hasOwnProperty("digi_settings")) {
        var newSettings = compareSettings(default_settings, storedSettings.digi_settings);
        if (storedSettings !== newSettings) {
            chrome.storage.local.clear();
            chrome.storage.local.set({digi_settings: newSettings});
        }
    } else {
        chrome.storage.local.set({digi_settings: compareSettings(default_settings, {})});
    }
}   

//https://stackoverflow.com/questions/48982568/javascript-change-data-in-json-by-string-data-path
function setItemByPath(data, path, value) {
    var k = data;
    var last = path.pop();

    path.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));

    k[last] = value;

    return data;
}

// listen for and handle messages
function handleMessage(request, sender, sendResponse) { //mostly unused code but idc
    console.log(request)
    if ("getSettingState" in request) {
        chrome.storage.local.get(function(item) {
            sendResponse({response: item.digi_settings[request.getSettingState.setting]["value"]});
        });
    } else if ("getSettingInputValue" in request) {
        chrome.storage.local.get(function(item) {
            sendResponse({response: item.digi_settings[request.getSettingInputValue.setting].inputs[request.getSettingInputValue.input]["value"]});
        });
    } else if ("getSettingStates" in request) {
        chrome.storage.local.get(function(item) {
            let states = [];
            for (let setting of request.getSettingStates.settings) 
                states.push(item.digi_settings[setting]["value"])
            sendResponse({response: states});
        });
    } else if ("getSettingInputValues" in request) {
        chrome.storage.local.get(function(item) {
            let values = [];
            for (let i = 0; i<request.getSettingInputValues.settings.length; i++)
                values.push(item.digi_settings[request.getSettingInputValues.settings[i]].inputs[request.getSettingInputValues.inputs[i]]["value"])
            sendResponse({response: values});
        });
    } else if ("setSettingState" in request) {
        chrome.storage.local.get(function(item) {
            let data = setItemByPath(item, ["digi-utils", request.setSettingState.setting, "value"], request.setSettingState.value);
            chrome.local.storage.set(data);
            sendResponse({response: data});
        });
    } else if ("setSettingInputValue" in request) {
        chrome.storage.local.get(function(item) {
            let data = setItemByPath(item, ["digi-utils"], request.setSettingInputValue.setting, "inputs", request.setSettingInputValue.input, request.setSettingInputValue.value);
            chrome.local.storage.set(data);
            sendResponse({response: data}); 
        });
    } else if ("setSettingStates" in request) {
        chrome.storage.local.get(function(item) {
            let data = item;
            for (let i=0; i<request.setSettingStates.settings.length; i++) {
                data = setItemByPath(data, ["digi-utils", request.setSettingStates.settings[i], "value"], request.setSettingStates.values[i]);
            }
            chrome.local.storage.set(data);
            sendResponse({response: data});
        });
    } else if ("setSettingInputValues" in request) {
        chrome.storage.local.get(function(item) {
            let values = [];
            for (let i = 0; i<request.getSettingInputValues.settings.length; i++)
                values.push(item.digi_settings[request.getSettingInputValues.settings[i]].inputs[request.getSettingInputValues.inputs[i]]["value"])
            sendResponse({response: values});
        });
        chrome.storage.local.get(function(item) {
            let data = item;
            for (let i=0; i<request.setSettingInputValues.settings.length; i++) {
                data = setItemByPath(data, ["digi-utils", request.setSettingInputValues.settings[i], "inputs", request.setSettingInputValues.inputs[i], "value"], request.setSettingInputValues.values[i]);
            }
            chrome.local.storage.set(data);
            sendResponse({response: data});
        });
    } else if ("getDefaultObject" in request) {
        sendResponse({response: default_settings})
    } else {
        sendResponse({response: "something else bruh"});
    }
    return true; // to send an asynchronous response
}

chrome.storage.local.get(checkStoredSettings);

chrome.runtime.onMessage.addListener(handleMessage);