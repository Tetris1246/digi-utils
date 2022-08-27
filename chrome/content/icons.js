console.log("digi-utils> icons.js loaded");

function loadIcons() {
    // icon css
    var head = document.getElementsByTagName('HEAD')[0];
    var link = document.createElement('style');

    var names = ["calendar", "dashboard", "register", "semester", "subjects", "absences", "homework", "messages", "course", "certificate"]
    
    for (const iconName of names) {
        link.innerHTML += `.digi-icon-${iconName}:before { background-image:url(${chrome.runtime.getURL(`icons/${iconName}.svg`)}) }`;
    }

    head.appendChild(link);

    // add icon classes to elements
    items = document.getElementsByClassName("item");
    // ignore first and last because profile and logout get no icon
    for (let i = 1; i < items.length-1; i++) {
        items[i].classList.add("item-icon");
        for (const iconName of names) {
            if (!items[i].getAttribute("href").includes("message")) {
                if (items[i].getAttribute("href").includes(iconName)) {
                    items[i].classList.add(`digi-icon-${iconName}`);
                }
            } else {
                items[i].classList.add("digi-icon-messages");
                items[i].classList.remove("item-icon-messages");
            }
        }
    }
}

getSettingState("icons", loadIcons);