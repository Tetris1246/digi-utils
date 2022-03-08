console.log("digi-utils> popup.js loaded");

// ToDo: rewrite this using for-loops
var checkbox_dark = document.getElementById("dark");
var checkbox_average = document.getElementById("average");
var checkbox_religion = document.getElementById("religion");
var checkbox_antiafk = document.getElementById("antiafk");
var checkbox_report = document.getElementById("report");
var checkbox_login = document.getElementById("login");

// save settings on checkbox change
function saveSettings() {
    browser.storage.local.set({digi_settings: {
        dark: checkbox_dark.checked,
        average: checkbox_average.checked,
        religion: checkbox_religion.checked,
        antiafk: checkbox_antiafk.checked,
        report: checkbox_report.checked,
        login: checkbox_login.checked
    }});
}

checkbox_dark.onchange = function() {
    saveSettings();
};
checkbox_average.onchange = function() {
    saveSettings();
};
checkbox_religion.onchange = function() {
    saveSettings();
};
checkbox_antiafk.onchange = function() {
    saveSettings();
};
checkbox_report.onchange = function() {
    saveSettings();
};
checkbox_login.onchange = function() {
    saveSettings();
};

// check checkboxes according to settings
function onGot(item) {
    checkbox_dark.checked = item.digi_settings.dark;
    checkbox_average.checked = item.digi_settings.average;
    checkbox_religion.checked = item.digi_settings.religion;
    checkbox_report.checked = item.digi_settings.report;
    checkbox_antiafk.checked = item.digi_settings.antiafk;
    checkbox_login.checked = item.digi_settings.login;
}
function onError(error) {
    console.log(`Error: ${error}`);
}
function updateCheckboxes() {
    let gettingItem = browser.storage.local.get();
    gettingItem.then(onGot, onError);
}

updateCheckboxes();
