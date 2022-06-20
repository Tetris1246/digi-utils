console.log("digi-utils> icons.js loaded");

function loadIcons() {
    // icon css
    var head = document.getElementsByTagName('HEAD')[0];
    var link = document.createElement('style');

    var names = ["calendar", "dashboard", "register", "semester", "subjects", "absences", "homework", "messages", "course", "certificate"]
    
    for (const name1 of names) {
        link.innerHTML += `.digi-icon-${name1}:before { background-image:url(${chrome.runtime.getURL(`icons/${name1}.svg`)}) }`;
    }

    head.appendChild(link);

    // add icon classes to elements
    items = document.getElementsByClassName("item");
    // ignore first and last because profile and logout get no icon
    for (let i = 1; i < items.length-1; i++) {
        items[i].classList.add("item-icon");
        for (const name1 of names) {
            if (!items[i].getAttribute("href").includes("message")) {
                if (items[i].getAttribute("href").includes(name1)) {
                    items[i].classList.add(`digi-icon-${name1}`);
                }
            } else {
                items[i].classList.add("digi-icon-messages");
                items[i].classList.remove("item-icon-messages");
            }
        }
    }
}

// send a message requesting the icon setting, resolve the promise once response is received
function handleResponse(message) {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    if (message.response === true) loadIcons();
}
chrome.runtime.sendMessage({setting: "icons"}, handleResponse);