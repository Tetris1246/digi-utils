console.log("digi-utils> icons.js loaded");

function handleRejection(message) {
    console.log(message);
}

function loadIcons() {
    // icon css
    var head = document.getElementsByTagName('HEAD')[0];
    var link = document.createElement('style');
    link.innerHTML =
        ".digi-icon-calendar:before {background-image:url(" + browser.runtime.getURL("icons/calendar.svg") + ")}" +
        ".digi-icon-dashboard:before {background-image:url(" + browser.runtime.getURL("icons/dashboard.svg") + ")}" +
        ".digi-icon-register:before {background-image:url(" + browser.runtime.getURL("icons/register.svg") + ")}" +
        ".digi-icon-semester:before {background-image:url(" + browser.runtime.getURL("icons/semester.svg") + ")}" +
        ".digi-icon-subjects:before {background-image:url(" + browser.runtime.getURL("icons/subjects.svg") + ")}" +
        ".digi-icon-absences:before {background-image:url(" + browser.runtime.getURL("icons/absences.svg") + ")}" +
        ".digi-icon-homework:before {background-image:url(" + browser.runtime.getURL("icons/homework.svg") + ")}" +
        ".digi-icon-messages:before {background-image:url(" + browser.runtime.getURL("icons/messages.svg") + ")}" +
        ".digi-icon-course:before {background-image:url(" + browser.runtime.getURL("icons/course.svg") + ")}" +
        ".digi-icon-certificate:before {background-image:url(" + browser.runtime.getURL("icons/certificate.svg") + ")}"
    head.appendChild(link);

    // add icon classes to elements
    items = document.getElementsByClassName("item");
    // ignore first and last because profile and logout get no icon
    for (let i = 1; i < items.length-1; i++) {
        items[i].classList.add("item-icon");
        if (items[i].getAttribute("href").includes("dashboard")) items[i].classList.add("digi-icon-dashboard");
        if (items[i].getAttribute("href").includes("absences")) items[i].classList.add("digi-icon-absences");
        if (items[i].getAttribute("href").includes("calendar")) items[i].classList.add("digi-icon-calendar");
        if (items[i].getAttribute("href").includes("homework")) items[i].classList.add("digi-icon-homework");
        if (items[i].getAttribute("href").includes("subjects")) items[i].classList.add("digi-icon-subjects");
        if (items[i].getAttribute("href").includes("course")) items[i].classList.add("digi-icon-course");
        if (items[i].getAttribute("href").includes("register")) items[i].classList.add("digi-icon-register");
        if (items[i].getAttribute("href").includes("certificate")) items[i].classList.add("digi-icon-certificate");
        if (items[i].getAttribute("href").includes("semester")) items[i].classList.add("digi-icon-semester");
        if (items[i].getAttribute("href").includes("message")) {
            items[i].classList.add("digi-icon-messages");
            items[i].classList.remove("item-icon-messages");
        }
    }
}

// send a message requesting the icon setting, resolve the promise once response is received
const loadIconSetting = new Promise((resolve, reject) => {
    function handleResponse(message) {
        if (message.response === true) resolve();
        else reject('fancy icons is not activated');
    }
    function handleError(error) {
        reject(error);
    }
    let sending = browser.runtime.sendMessage({setting: "icons"});
    sending.then(handleResponse, handleError);
});

// if loadIconSetting resolves the promise, load icons
loadIconSetting.then(loadIcons, handleRejection);