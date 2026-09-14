// GET DATA FROM LOCAL STORAGE
const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "login.html";

}



let students =
    JSON.parse(localStorage.getItem("students")) || [];

let subjects =
    JSON.parse(localStorage.getItem("subjects")) || [];

let results =
    JSON.parse(localStorage.getItem("results")) || [];


// ELEMENTS

const totalStudents =
    document.getElementById("totalStudents");

const totalSubjects =
    document.getElementById("totalSubjects");

const totalResults =
    document.getElementById("totalResults");

const overallAverage =
    document.getElementById("overallAverage");

const studentPerformance =
    document.getElementById("studentPerformance");

const subjectPerformance =
    document.getElementById("subjectPerformance");


// UPDATE OVERVIEW

function updateOverview() {

    totalStudents.textContent =
        students.length;

    totalSubjects.textContent =
        subjects.length;

    totalResults.textContent =
        results.length;


    if (results.length === 0) {

        overallAverage.textContent = "0%";

        return;
    }


    const totalMarks = results.reduce(
        function(total, result) {

            return total + Number(result.marks);

        },
        0
    );


    const average =
        totalMarks / results.length;


    overallAverage.textContent =
        `${average.toFixed(1)}%`;
}


// STUDENT PERFORMANCE

function generateStudentPerformance() {

    studentPerformance.innerHTML = "";


    students.forEach(function(student) {

        const studentResults =
            results.filter(function(result) {

                return result.studentId === student.id;

            });


        if (studentResults.length === 0) {

            return;

        }


        const totalMarks =
            studentResults.reduce(
                function(total, result) {

                    return total + Number(result.marks);

                },
                0
            );


        const average =
            totalMarks / studentResults.length;


        const status =
            average >= 50
                ? "Pass"
                : "Fail";


        const statusClass =
            average >= 50
                ? "status-pass"
                : "status-fail";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.name}</td>

            <td>${student.id}</td>

            <td>${studentResults.length}</td>

            <td>${average.toFixed(1)}%</td>

            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>

        `;


        studentPerformance.appendChild(row);

    });


    if (studentPerformance.children.length === 0) {

        studentPerformance.innerHTML = `

            <tr>

                <td colspan="5">
                    No student results available.
                </td>

            </tr>

        `;

    }
}


// SUBJECT PERFORMANCE

function generateSubjectPerformance() {

    subjectPerformance.innerHTML = "";


    subjects.forEach(function(subject) {

        const subjectResults =
            results.filter(function(result) {

                return result.subjectCode === subject.code;

            });


        if (subjectResults.length === 0) {

            return;

        }


        const totalMarks =
            subjectResults.reduce(
                function(total, result) {

                    return total + Number(result.marks);

                },
                0
            );


        const average =
            totalMarks / subjectResults.length;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${subject.name}</td>

            <td>${subject.code}</td>

            <td>${subjectResults.length}</td>

            <td>${average.toFixed(1)}%</td>

        `;


        subjectPerformance.appendChild(row);

    });


    if (subjectPerformance.children.length === 0) {

        subjectPerformance.innerHTML = `

            <tr>

                <td colspan="4">
                    No subject results available.
                </td>

            </tr>

        `;

    }
}


// GRADE DISTRIBUTION

function generateGradeDistribution() {

    const gradeCounts = {

        A: 0,

        B: 0,

        C: 0,

        D: 0,

        F: 0

    };


    results.forEach(function(result) {

        if (gradeCounts[result.grade] !== undefined) {

            gradeCounts[result.grade]++;

        }

    });


    document.getElementById("gradeA").textContent =
        gradeCounts.A;

    document.getElementById("gradeB").textContent =
        gradeCounts.B;

    document.getElementById("gradeC").textContent =
        gradeCounts.C;

    document.getElementById("gradeD").textContent =
        gradeCounts.D;

    document.getElementById("gradeF").textContent =
        gradeCounts.F;
}


// SIDEBAR

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


menuBtn.addEventListener("click", function() {

    sidebar.classList.toggle("open");

});


// INITIALISE

updateOverview();

generateStudentPerformance();

generateSubjectPerformance();

generateGradeDistribution();