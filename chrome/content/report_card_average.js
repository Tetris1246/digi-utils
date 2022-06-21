console.log("digi-utils> report_card_average.js loaded")

function waitfor(test, expectedValue, msec, callback) {
    if (test() !== expectedValue) {
        setTimeout(function() {
            waitfor(test, expectedValue, msec, callback);
        }, msec);
        return;
    }
    callback();
}

function handleRejection(message) {
    console.log(message);
}

var grade_conv = {
    0.25: "0+",
    0.5: "0/1",
    0.75: "1-",
    1.25: "1+",
    1.5: "1/2",
    1.75: "2-",
    2.25: "2+",
    2.5: "2/3",
    2.75: "3-",
    3.25: "3+",
    3.5: "3/4",
    3.75: "4-",
    4.25: "4+",
    4.5: "4/5",
    4.75: "5-",
    5.25: "5+",
    5.5: "5/6",
    5.75: "6-",
    6.25: "6+",
    6.5: "6/7",
    6.75: "7-",
    7.25: "7+",
    7.5: "7/8",
    7.75: "8-",
    8.25: "8+",
    8.5: "8/9",
    8.75: "9-",
    9.25: "9+",
    9.5: "9/10",
    9.75: "10-"
};

function add_row_to_table(name, grade) {
    var floored_grade = Math.floor(grade * 100) / 100;

    var tbody = document.getElementsByTagName("tbody")[0];

    var tr = document.createElement("tr");

    var name_element = document.createElement("td");
    name_element.className = "padding-cell";
    name_element.style = "vertical-align: top;";
    name_element.textContent = name;

    var grade_container = document.createElement("td");
    grade_container.className = "padding-cell";
    grade_container.style = "vertical-align: top;";

    var grade_element = document.createElement("span");
    grade_element.className = (floored_grade > 6) ? "green" : "red";
    grade_element.textContent = ((floored_grade in grade_conv) ? grade_conv[floored_grade] : floored_grade);

    var useless_element = document.createElement("td"); //to make the table wide enough

    grade_container.appendChild(grade_element);
    tr.appendChild(name_element);
    tr.appendChild(grade_container);
    tr.appendChild(useless_element);
    tbody.appendChild(tr);
}

function get_average(map) {
    var average = 0;

    for (const grades_and_weight of map.values()) {
        var weight = grades_and_weight.weight;
        var grade = grades_and_weight.grade;
        average += grade * weight;
    }

    return average / map.size / 100;
}

function get_average_grade() {
    var grades = new Map();
    var names_and_grades = document.getElementsByTagName("td");

    for (var i=0; i<names_and_grades.length; i+=3) {
        grades.set(names_and_grades[i].textContent, {grade: parseInt(names_and_grades[i+1].textContent), weight: 100});
    }

    var average = get_average(grades);

    var grades_without_religion = grades;

    grades_without_religion.delete("REL");

    var average_without_religion = get_average(grades_without_religion);

    add_row_to_table("Durchschnitt", average);
    add_row_to_table("Durchschnitt ohne Religion", average_without_religion);
}

function grades_are_loaded() {
        if (document.getElementsByTagName("td").length > 0) return true;
    return false;
}

function loadReportAverage() {
    if (document.location.href.endsWith("#student/certificate")) {
        waitfor(grades_are_loaded, true, 50, get_average_grade);
    }
}

// send a message requesting the report setting, resolve the promise once response is recieved
function handleResponse(message) {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    if (message.response === true) loadReportAverage();
}
chrome.runtime.sendMessage({setting: "report"}, handleResponse);