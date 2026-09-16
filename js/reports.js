

// AUTHENTICATION
// =================================

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

const authToken =
    localStorage.getItem("authToken");


if (!currentUser || !authToken) {

    window.location.href =
        "login.html";

}


// =================================
// AUTHENTICATION HEADERS
// =================================

function getAuthHeaders() {

    const token =
        localStorage.getItem("authToken");

    return {

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


// =================================
// LOGOUT
// =================================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    localStorage.removeItem(
        "authToken"
    );

    window.location.href =
        "login.html";

}


// =================================
// API URLS
// =================================

const STUDENTS_API =
    "http://localhost:3000/api/students";

const SUBJECTS_API =
    "http://localhost:3000/api/subjects";

const RESULTS_API =
    "http://localhost:3000/api/results";


// =================================
// DATA
// =================================

let students = [];

let subjects = [];

let results = [];


// =================================
// ELEMENTS
// =================================

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


// =================================
// LOAD STUDENTS
// =================================

async function loadStudents() {

    try {

        const response =
            await fetch(
                STUDENTS_API,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        // Token invalid or expired
        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load students."
            );

        }


        students =
            await response.json();


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        alert(
            "Unable to load students."
        );

    }

}


// =================================
// LOAD SUBJECTS
// =================================

async function loadSubjects() {

    try {

        const response =
            await fetch(
                SUBJECTS_API,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        // Token invalid or expired
        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load subjects."
            );

        }


        subjects =
            await response.json();


    } catch (error) {

        console.error(
            "Error loading subjects:",
            error
        );


        alert(
            "Unable to load subjects."
        );

    }

}


// =================================
// LOAD RESULTS
// =================================

async function loadResults() {

    try {

        const response =
            await fetch(
                RESULTS_API,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        // Token invalid or expired
        if (
            response.status === 401 ||
            response.status === 403
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load results."
            );

        }


        results =
            await response.json();


    } catch (error) {

        console.error(
            "Error loading results:",
            error
        );


        alert(
            "Unable to load results."
        );

    }

}


// =================================
// UPDATE OVERVIEW
// =================================

function updateOverview() {

    totalStudents.textContent =
        students.length;


    totalSubjects.textContent =
        subjects.length;


    totalResults.textContent =
        results.length;


    if (results.length === 0) {

        overallAverage.textContent =
            "0%";

        return;

    }


    const totalMarks =
        results.reduce(
            function(total, result) {

                return (
                    total +
                    Number(result.marks)
                );

            },
            0
        );


    const average =
        totalMarks /
        results.length;


    overallAverage.textContent =
        `${average.toFixed(1)}%`;

}


// =================================
// STUDENT PERFORMANCE
// =================================

function generateStudentPerformance() {

    studentPerformance.innerHTML =
        "";


    students.forEach(
        function(student) {


            const studentResults =
                results.filter(
                    function(result) {

                        return (
                            Number(result.student_id) ===
                            Number(student.id)
                        );

                    }
                );


            // Skip students without results

            if (
                studentResults.length === 0
            ) {

                return;

            }


            const totalMarks =
                studentResults.reduce(
                    function(total, result) {

                        return (
                            total +
                            Number(result.marks)
                        );

                    },
                    0
                );


            const average =
                totalMarks /
                studentResults.length;


            const status =
                average >= 50
                    ? "Pass"
                    : "Fail";


            const statusClass =
                average >= 50
                    ? "status-pass"
                    : "status-fail";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${student.name}
                </td>

                <td>
                    ${student.student_id}
                </td>

                <td>
                    ${studentResults.length}
                </td>

                <td>
                    ${average.toFixed(1)}%
                </td>

                <td>

                    <span
                        class="status ${statusClass}"
                    >
                        ${status}
                    </span>

                </td>

            `;


            studentPerformance.appendChild(
                row
            );

        }
    );


    // =================================
    // EMPTY STATE
    // =================================

    if (
        studentPerformance.children.length === 0
    ) {

        studentPerformance.innerHTML = `

            <tr>

                <td colspan="5">
                    No student results available.
                </td>

            </tr>

        `;

    }

}


// =================================
// SUBJECT PERFORMANCE
// =================================

function generateSubjectPerformance() {

    subjectPerformance.innerHTML =
        "";


    subjects.forEach(
        function(subject) {


            const subjectResults =
                results.filter(
                    function(result) {

                        return (
                            Number(result.subject_id) ===
                            Number(subject.id)
                        );

                    }
                );


            // Skip subjects without results

            if (
                subjectResults.length === 0
            ) {

                return;

            }


            const totalMarks =
                subjectResults.reduce(
                    function(total, result) {

                        return (
                            total +
                            Number(result.marks)
                        );

                    },
                    0
                );


            const average =
                totalMarks /
                subjectResults.length;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${subject.name}
                </td>

                <td>
                    ${subject.code}
                </td>

                <td>
                    ${subjectResults.length}
                </td>

                <td>
                    ${average.toFixed(1)}%
                </td>

            `;


            subjectPerformance.appendChild(
                row
            );

        }
    );


    // =================================
    // EMPTY STATE
    // =================================

    if (
        subjectPerformance.children.length === 0
    ) {

        subjectPerformance.innerHTML = `

            <tr>

                <td colspan="4">
                    No subject results available.
                </td>

            </tr>

        `;

    }

}


// =================================
// GRADE DISTRIBUTION
// =================================

function generateGradeDistribution() {

    const gradeCounts = {

        A: 0,

        B: 0,

        C: 0,

        D: 0,

        F: 0

    };


    results.forEach(
        function(result) {

            if (
                gradeCounts[result.grade] !==
                undefined
            ) {

                gradeCounts[result.grade]++;

            }

        }
    );


    document.getElementById(
        "gradeA"
    ).textContent =
        gradeCounts.A;


    document.getElementById(
        "gradeB"
    ).textContent =
        gradeCounts.B;


    document.getElementById(
        "gradeC"
    ).textContent =
        gradeCounts.C;


    document.getElementById(
        "gradeD"
    ).textContent =
        gradeCounts.D;


    document.getElementById(
        "gradeF"
    ).textContent =
        gradeCounts.F;

}


// =================================
// SIDEBAR
// =================================

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );


menuBtn.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);


// =================================
// INITIALIZE REPORTS
// =================================

async function initialize() {

    await loadStudents();

    await loadSubjects();

    await loadResults();


    updateOverview();

    generateStudentPerformance();

    generateSubjectPerformance();

    generateGradeDistribution();

}


// =================================
// START APPLICATION
// =================================

initialize();

