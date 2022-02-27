console.log("digi-utils> color_theme.js loaded!");

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

// send a message requesting the dark setting, resolve the promise once response is recieved
const loadDarkSetting = new Promise((resolve, reject) => {
    function handleResponse(message) {
        if (message.response === true) resolve();
        else reject('color theme is not dark');
    }
    function handleError(error) {
        reject(error);
    }
    let sending = browser.runtime.sendMessage({setting: "dark"});
    sending.then(handleResponse, handleError);
});

// if loadDarkSetting resolves the promise, load the dark theme
loadDarkSetting.then(loadDarkTheme, handleRejection);