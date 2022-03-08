console.log("digi-utils> anti_afk.js loaded!");

function handleRejection(message) {
    console.log(message);
}

// load a stylesheet-link to dark.css into the html head
function loadAntiAfk() {
    if (!document.location.href.endsWith("login")) {
        setInterval(function () {
            console.log("sent");
            AutoLogout.checklogin();
        }, 60_000)
    }
}

// send a message requesting the antiafk setting, resolve the promise once response is recieved
const loadAntiafkSetting = new Promise((resolve, reject) => {
    function handleResponse(message) {
        if (message.response === true) resolve();
        else reject('anti-afk is not activated');
    }
    function handleError(error) {
        reject(error);
    }
    let sending = browser.runtime.sendMessage({setting: "antiafk"});
    sending.then(handleResponse, handleError);
});

// if loadDarkSetting resolves the promise, load the dark theme
loadAntiafkSetting.then(loadAntiAfk, handleRejection);


