if (document.location.href.split("?")[0].endsWith("login")) {
    let images = document.getElementsByTagName("img");
    for (let i=0; i<images.length; i++) {
        if (images[i].alt == "Limitis") {
            images[i].src = chrome.runtime.getURL("icons/limitis.svg");
        }
    }
}