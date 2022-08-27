console.log("digi-utils> color_theme.js loaded");

function handleRejection(message) {
    console.log(message);
}

// load a stylesheet-link to dark.css into the html head
function loadDarkTheme() {
    var head = document.getElementsByTagName('HEAD')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = browser.runtime.getURL("css/dark.css");
    head.appendChild(link);
}

getSettingState("dark", loadDarkTheme);