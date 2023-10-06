console.log("digi-utils> grade_average.js loaded");

function getGrades(callback) {
    let url = `https://${document.location.href.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1]}/v2/api/student/all_subjects`;
    fetch(url).then(res => res.json()).then(function(json) {
        callback(json);
    });
}

function calculateGrades(requestObject) {
    let subjects = requestObject.subjects;

    let semesterTotal = 0;
    let semesterCounter = 0;

    let yearTotal = 0;
    let yearCounter = 0;

    let totalTotal = 0;
    let totalWeight = 0;

    for (subject of subjects) {
        if (subject.grades.length > 0) {
            semesterTotal += subject.averageSemester;
            semesterCounter++;

            yearTotal += subject.averageYear;
            yearCounter++;

            for (gradeInfo of subject.grades) {
                if (gradeInfo.cancelledTimeStamp == null) {
                    totalTotal += gradeInfo.grade*(gradeInfo.weight/100);
                    totalWeight += (gradeInfo.weight/100)
                }
            }
        }
    }

    return {
        semesterAverage: (semesterTotal/semesterCounter).toFixed(2),
        yearAverage: (yearTotal/yearCounter).toFixed(2),
        totalAverage: (totalTotal/totalWeight).toFixed(2)

    };
}

function showGrades(requestObject) {
    let grades = calculateGrades(requestObject);

    // display averages
    let stats = document.getElementById("averageContainer");
    stats.style.margin = "";
    stats.innerHTML = "";
    let semesterSpan = document.createElement("span");
    semesterSpan.innerHTML = "Semester: " + grades.semesterAverage;
    semesterSpan.style.marginRight = "30px";
    let yearSpan = document.createElement("span");
    yearSpan.innerHTML = "Jahr " + grades.yearAverage;
    yearSpan.style.marginRight = "30px";
    yearSpan.style.fontSize = "15px";
    let totalSpan = document.createElement("span");
    totalSpan.innerHTML = "Gesamt " + grades.totalAverage;
    totalSpan.style.fontSize = "15px";
    gradeAverage = document.createElement("h1");
    gradeAverage.style.fontSize = "25px";
    gradeAverage.className = "h1";
    gradeAverage.style.margin = "0";
    gradeAverage.style.marginTop = "15px";
    gradeAverage.innerHTML = "Ø ";
    gradeAverage.appendChild(semesterSpan);
    gradeAverage.appendChild(yearSpan);
    gradeAverage.appendChild(totalSpan);
    stats.appendChild(gradeAverage);
}

function showAverages() {
    if (document.getElementById("averageContainer") !== null) {
        return;
    }

    let container = document.getElementsByClassName("student-statistics row")[0];

    let averageContainer = document.createElement("div");

    averageContainer.id = "averageContainer";

    container.insertBefore(averageContainer, container.firstChild);

    getGrades(function(requestObject) {
        showGrades(requestObject);
    });
}

function subjectsAreLoaded() {
    if (document.getElementById("studentSubjectApp") !== null) {
        if (document.getElementsByClassName("student-statistics row") !== null) {
            if (document.getElementsByTagName("grade-isolated").length > 0) return true;
            // technically only the last statement is necessary, but it's cool to observe the page-loading-progress
        }
    }
    return false;
}

function enableGradeAverage() {
    // if the grades-button is clicked, wait for the grades to load
    if (!document.location.href.endsWith("login")) {
        document.getElementsByClassName("v2-main-navigation main-navigation-show-mobile")[0].childNodes[6].addEventListener("click", function () {
            waitfor(subjectsAreLoaded, true, 50, function () {
                showAverages();
            });
        });
    }

    // do one grade calculation, in case the user navigates to the subjects-page via link or refresh
    if (document.location.href.endsWith("#student/subjects")) {
        waitfor(subjectsAreLoaded, true, 50, function() {
            showAverages();
        });
    }
}
    
getSettingState("average", enableGradeAverage);