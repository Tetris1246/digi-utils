function getSettingState(setting, callFunction) {
    browser.runtime.sendMessage({"getSettingState": {"setting": setting}}).then(function(message) {
        if (message.response === true) callFunction();
    }, function(e){console.error(e)});
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
    browser.runtime.sendMessage({"getSettingInputValue": {"setting": setting, "input": input}}).then(function(message) {
        callFunction(message);
    }, function(e){console.error(e)});
}