console.log("digi-utils> report_card_average.js loaded")

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

function addRowToTable(name, grade) {
    var flooredGrade = Math.floor(grade * 100) / 100;

    var tbody = document.getElementsByTagName("tbody")[0];

    var tr = document.createElement("tr");

    var nameElement = document.createElement("td");
    nameElement.className = "padding-cell";
    nameElement.style = "vertical-align: top;";
    nameElement.textContent = name;

    var gradeContainer = document.createElement("td");
    gradeContainer.className = "padding-cell";
    gradeContainer.style = "vertical-align: top;";

    var gradeElement = document.createElement("span");
    gradeElement.className = (flooredGrade > 6) ? "green" : "red";
    gradeElement.textContent = ((flooredGrade in grade_conv) ? grade_conv[flooredGrade] : flooredGrade);

    var useless_element = document.createElement("td"); //to make the table wide enough

    gradeContainer.appendChild(gradeElement);
    tr.appendChild(nameElement);
    tr.appendChild(gradeContainer);
    tr.appendChild(useless_element);
    tbody.appendChild(tr);
}

function get_average(map) {
    var average = 0;

    for (const gradeWeightMap of map.values()) {
        var weight = gradeWeightMap.weight;
        var grade = gradeWeightMap.grade;
        average += grade * weight;
    }

    return average / map.size / 100;
}

function getAverageGrade() {
    var grades = new Map();
    var namesAndGrades = document.getElementsByTagName("td");

    for (var i=0; i<namesAndGrades.length; i+=3) {
        grades.set(namesAndGrades[i].textContent, {grade: parseInt(namesAndGrades[i+1].textContent), weight: 100});
    }

    var average = get_average(grades);

    var gradesWithoutReligion = grades;

    gradesWithoutReligion.delete("REL");

    var averageWithoutReligion = get_average(gradesWithoutReligion);

    addRowToTable("Durchschnitt", average);
    addRowToTable("Durchschnitt ohne Religion", averageWithoutReligion);
}

function gradesAreLoaded() {
        if (document.getElementsByTagName("td").length > 0) return true;
    return false;
}

function loadReportAverage() {
    if (document.location.href.endsWith("#student/certificate")) {
        waitfor(gradesAreLoaded, true, 50, getAverageGrade);
    }
}

getSettingState("report", loadReportAverage);