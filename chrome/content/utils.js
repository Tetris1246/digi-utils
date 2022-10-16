function getSettingState(setting, callFunction) {
    chrome.runtime.sendMessage({"getSettingState": {"setting": setting}}, function (message) {
        if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
        if (message.response === true) callFunction();
    });
}


// https://stackoverflow.com/questions/7193238/wait-until-a-condition-is-true
// test: function that returns a value
// expectedValue: the value of the test function we are waiting for
// msec: delay between the calls to test
// callback: function to execute when the condition is met
function waitfor(test, expectedValue, msec, callback) {
    if (test() !== expectedValue) {
        setTimeout(function() {
            waitfor(test, expectedValue, msec, callback);
        }, msec);
        return;
    }
    callback();
}

function getSettingInputValue(setting, input, callFunction) {
    chrome.runtime.sendMessage({"getSettingInputValue": {"setting": setting, "input": input}}, function (message) {
        if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
        callFunction(message);
    });
}