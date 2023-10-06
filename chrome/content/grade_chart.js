console.log("digi-utils> grade_chart.js loaded");

function getGrades(callback) {
    let url = `https://${document.location.href.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1]}/v2/api/student/all_subjects`;
    fetch(url).then(res => res.json()).then(function(json) {
        callback(json);
    });
}

function getCompleteDatasets(json, allowedSemesters = [1, 2]) {
    let datasets = [];
    for (let subject of json.subjects) {
        if (subject.grades.length > 0) {

            let data = [];

            for (let gradeInfo of subject.grades) {
                if (gradeInfo.cancelledTimeStamp == null) {
                    if (allowedSemesters.includes(Number(gradeInfo.semester))) {
                        data.push({
                        x: gradeInfo.date,
                        y: gradeInfo.grade
                    });
                    }
                }
                
            }

            let subIndex = json.subjects.indexOf(subject);
            let amount = json.subjects.length;

            let subjectData = {
                label: subject.subject.name,        
                borderColor: `rgb(${darkColor(getColorByIndex(subIndex, amount), subIndex).join(',')})`,
                data: data,
                fill: false
            }

            datasets.push(subjectData);
        }
    }
    return datasets;
}

function createChart(json, canvas, allowedSemesters) {
    Chart.defaults.global.defaultFontColor = "rgb(255,255,255)";
    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 50;
    };
    new Chart(canvas, {
        type: 'line',
        data: {
            datasets: getCompleteDatasets(json, allowedSemesters)
        },
        options: {
            elements: {
                line: {
                    tension: 0
                }
            },
            scales: {
                yAxes: [
                            {
                            ticks: {
                            beginAtZero: false,
                            suggestedMin: 4,
                            max:10
                            },
                            gridLines: {
                                color: "rgb(122,122,122)"
                            }
                        }
                    ],
                xAxes: [
                    {
                        type: 'time',
                        time: {
                        parser: 'YYYY-MM-DD',
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM'
                        },
                        tooltipFormat: 'DD.MM.YY'
                        },
                        gridLines: {
                            color: "rgb(122,122,122)"
                        }
                    }
                ]
            },
            legend: {
                onClick: function(e, legendItem) {
                    //stolen from here: https://codepen.io/jordanwillis/pen/BWKKKo
                    var index = legendItem.datasetIndex;
                    var ci = this.chart;
                    var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;
          
                    ci.data.datasets.forEach(function(e, i) {
                      var meta = ci.getDatasetMeta(i);
          
                      if (i !== index) {
                        if (!alreadyHidden) {
                          meta.hidden = meta.hidden === null ? !meta.hidden : null;
                        } else if (meta.hidden === null) {
                          meta.hidden = true;
                        }
                      } else if (i === index) {
                        meta.hidden = null;
                      }
                    });
          
                    ci.update();
                }
            }
        }
    });
}

function renderChart(requestObject) {
    let domain = document.location.href.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];

    let container = document.createElement("div");
    let chartContainer = document.createElement("div");
    let chart = document.createElement("canvas");
    let semesterSelector = document.createElement("select");
    let expandButton = document.createElement("img");
    let collapseButton = document.createElement("img");

    semesterSelector.style.backgroundColor = "#272727";
    semesterSelector.style.margin = "10px";
    semesterSelector.style.padding = "5px";
    semesterSelector.style.borderColor = "#272727";
    semesterSelector.style.borderRadius = "5px";
    semesterSelector.id = "semesterSelection";
    semesterSelector.onchange = function() {
        createChart(requestObject, document.getElementById("chart"), getSelectedSemester());
    };

    for (let selection of ["1. Semester", "2. Semester", "Beide Semester"]) {
        let option = document.createElement("option");
        option.innerText = selection;
        if (selection == "Beide Semester") {
            option.selected = true;
        }
        semesterSelector.appendChild(option);
    }

    container.style.padding = "8px 20px";
    container.style.background = "#303030";
    container.style.borderRadius = "5px";
    container.style.backgroundColor = "#303030";
    container.style.marginTop = "10px";

    expandButton.src = `https://${domain}/v2/theme/icons/expand.svg`;
    expandButton.style.backgroundSize = "cover";
    expandButton.style.width = "28px";
    expandButton.style.height = "28px";
    expandButton.style.borderRadius = "50%";
    expandButton.style.backgroundColor = "#202020";
    expandButton.style.margin = "5px auto";
    expandButton.style.filter = "invert(81%)";

    expandButton.addEventListener("click", function() {
        bigChart();
        expandButton.style.visibility = "hidden";
        collapseButton.style.visibility = "visible";
    });

    collapseButton.src = `https://${domain}/v2/theme/icons/collapse.svg`;
    collapseButton.style.visibility = "hidden";
    collapseButton.style.backgroundSize = "cover";
    collapseButton.style.width = "28px";
    collapseButton.style.height = "28px";
    collapseButton.style.borderRadius = "50%";
    collapseButton.style.backgroundSize = "cover";
    collapseButton.style.backgroundColor = "#202020";
    collapseButton.style.margin = "5px auto";
    collapseButton.style.filter = "invert(81%)";

    collapseButton.addEventListener("click", function() {
        smallChart();
        expandButton.style.visibility = "visible";
        collapseButton.style.visibility = "hidden";
    });

    
    chart.id = "chart";

    chartContainer.appendChild(chart);
    container.appendChild(semesterSelector);
    container.appendChild(chartContainer);

    container.appendChild(expandButton);
    container.appendChild(collapseButton);

    document.getElementById("chartContainer").appendChild(container);

    createChart(requestObject, document.getElementById("chart"), getSelectedSemester());
    smallChart();
}

function getSelectedSemester() {
    let value = document.getElementById("semesterSelection").value;
    return value == "1. Semester" ? [1] : value == "2. Semester" ? [2] : [1, 2];
}

function smallChart() {
    let chart = document.getElementById("chart");
    chart.style.height = "150px";
}

function bigChart() {
    let chart = document.getElementById("chart");
    chart.style.height = "auto";
}

function showChart() {
    if (document.getElementById("chartContainer") !== null) {
        return;
    }

    let container = document.getElementsByClassName("student-statistics row")[0];

    let chartContainer = document.createElement("div");

    chartContainer.id = "chartContainer";

    container.appendChild(chartContainer);
    
    getGrades(function(requestObject) {
        renderChart(requestObject);
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

function enableGradeChart() {
    // if the grades-button is clicked, wait for the grades to load
    if (!document.location.href.endsWith("login")) {
        document.getElementsByClassName("v2-main-navigation main-navigation-show-mobile")[0].childNodes[6].addEventListener("click", function () {
            waitfor(subjectsAreLoaded, true, 50, function () {
                showChart();
            });
        });
    }

    // do one grade calculation, in case the user navigates to the subjects-page via link or refresh
    if (document.location.href.endsWith("#student/subjects")) {
        waitfor(subjectsAreLoaded, true, 50, function() {
            showChart();
        });
    }
}
    
getSettingState("chart", enableGradeChart);