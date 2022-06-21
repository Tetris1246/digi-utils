console.log("digi-utils> popup.js loaded");

const checkbox_map = new Map();
var names = ["dark", "average", "antiafk", "report", "login", "icons"];

for (var i=0; i<names.length; i++) {
    checkbox_map.set(`checkbox_${names[i]}`, document.getElementById(names[i]));
}

// save settings on checkbox change
function saveSettings() {
    browser.storage.local.set({digi_settings: {
        dark: checkbox_map.get("checkbox_dark").checked,
        average: checkbox_map.get("checkbox_average").checked,
        antiafk: checkbox_map.get("checkbox_antiafk").checked,
        report: checkbox_map.get("checkbox_report").checked,
        login: checkbox_map.get("checkbox_login").checked,
        icons: checkbox_map.get("checkbox_icons").checked
    }});
}

for (const element of checkbox_map.values()) {
    element.onchange = saveSettings;
}

// check checkboxes according to settings
function onGot(item) {
    checkbox_map.get("checkbox_dark").checked = item.digi_settings.dark;
    checkbox_map.get("checkbox_average").checked = item.digi_settings.average;
    checkbox_map.get("checkbox_antiafk").checked = item.digi_settings.antiafk;
    checkbox_map.get("checkbox_report").checked = item.digi_settings.report;
    checkbox_map.get("checkbox_login").checked = item.digi_settings.login;
    checkbox_map.get("checkbox_icons").checked = item.digi_settings.icons;
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function updateCheckboxes() {
    let gettingItem = browser.storage.local.get();
    gettingItem.then(onGot, onError);
}

updateCheckboxes();