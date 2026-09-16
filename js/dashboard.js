// =================================
// AUTHENTICATION
// =================================

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}


// =================================
// API URLS
// =================================

const DASHBOARD_API =
    "http://localhost:3000/api/dashboard";

const STUDENTS_API =
    "http://localhost:3000/api/students";

const RESULTS_API =
    "http://localhost:3000/api/results";


// =================================
// SIDEBAR
// =================================

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");

        }
    );

}


// =================================
// USER PROFILE
// =================================

const loggedInUser =
    document.getElementById("loggedInUser");

const profileIcon =
    document.getElementById("profileIcon");

const welcomeUser =
    document.getElementById("welcomeUser");


if (currentUser) {

    if (loggedInUser) {

        loggedInUser.textContent =
            currentUser.name;

    }


    if (profileIcon) {

        profileIcon.textContent =
            currentUser.name
                .charAt(0)
                .toUpperCase();

    }


    if (welcomeUser) {

        welcomeUser.textContent =
            `Hello, ${currentUser.name} 👋`;

    }

}


// =================================
// LOAD DASHBOARD STATISTICS
// =================================

async function loadDashboard() {

    console.log(
        "loadDashboard() is running"
    );


    try {

        console.log(
            "Loading dashboard..."
        );


        const response =
            await fetch(
                DASHBOARD_API,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        console.log(
            "Dashboard status:",
            response.status
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            console.log(
                "Authentication failed."
            );

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Dashboard request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Dashboard data:",
            data
        );


        // =================================
        // TOTAL STUDENTS
        // =================================

        const totalStudents =
            document.getElementById(
                "totalStudents"
            );


        if (totalStudents) {

            totalStudents.textContent =
                data.totalStudents ?? 0;

        }


        // =================================
        // TOTAL SUBJECTS
        // =================================

        const totalSubjects =
            document.getElementById(
                "totalSubjects"
            );


        if (totalSubjects) {

            totalSubjects.textContent =
                data.totalSubjects ?? 0;

        }


        // =================================
        // TOTAL RESULTS
        // =================================

        const totalResults =
            document.getElementById(
                "totalResults"
            );


        if (totalResults) {

            totalResults.textContent =
                data.totalResults ?? 0;

        }


        // =================================
        // AVERAGE MARK
        // =================================

        const averageMark =
            document.getElementById(
                "averageMark"
            );


        if (averageMark) {

            console.log(
                "Average element found:",
                averageMark
            );


            console.log(
                "Average value received:",
                data.averageMark
            );


            averageMark.textContent =
                `${data.averageMark ?? 0}%`;

        }


        // =================================
        // PASS RATE
        // =================================

        const passRate =
            document.getElementById(
                "passRate"
            );


        if (passRate) {

            passRate.textContent =
                `${data.passRate ?? 0}%`;

        }


        console.log(
            "Dashboard updated successfully."
        );


    } catch (error) {

        console.error(
            "Error loading dashboard:",
            error
        );

    }

}


// =================================
// LOAD RECENT STUDENTS
// =================================

async function loadRecentStudents() {

    try {

        console.log(
            "Loading recent students..."
        );


        // =================================
        // LOAD STUDENTS
        // =================================

        const studentsResponse =
            await fetch(
                STUDENTS_API,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        console.log(
            "Students status:",
            studentsResponse.status
        );


        if (
            studentsResponse.status === 401 ||
            studentsResponse.status === 403
        ) {

            logout();

            return;

        }


        if (!studentsResponse.ok) {

            throw new Error(
                `Students request failed: ${studentsResponse.status}`
            );

        }


        const students =
            await studentsResponse.json();


        console.log(
            "Students:",
            students
        );


        // =================================
        // LOAD RESULTS
        // =================================

        const resultsResponse =
            await fetch(
                RESULTS_API,
                {
                    method: "GET",
                    headers:
                        getAuthHeaders()
                }
            );


        console.log(
            "Results status:",
            resultsResponse.status
        );


        if (
            resultsResponse.status === 401 ||
            resultsResponse.status === 403
        ) {

            logout();

            return;

        }


        if (!resultsResponse.ok) {

            throw new Error(
                `Results request failed: ${resultsResponse.status}`
            );

        }


        const results =
            await resultsResponse.json();


        console.log(
            "Results:",
            results
        );


        // =================================
        // DISPLAY STUDENTS
        // =================================

        displayRecentStudents(
            students,
            results
        );


    } catch (error) {

        console.error(
            "Error loading recent students:",
            error
        );

    }

}


// =================================
// DISPLAY RECENT STUDENTS
// =================================

function displayRecentStudents(
    students,
    results
) {

    const recentStudentsBody =
        document.getElementById(
            "recentStudentsBody"
        );


    if (!recentStudentsBody) {

        console.error(
            "recentStudentsBody was not found."
        );

        return;

    }


    recentStudentsBody.innerHTML =
        "";


    // =================================
    // NO STUDENTS
    // =================================

    if (
        !students ||
        students.length === 0
    ) {

        recentStudentsBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align: center;"
                >

                    No students registered yet.

                </td>

            </tr>

        `;

        return;

    }


    // =================================
    // SORT NEWEST STUDENTS FIRST
    // =================================

    const recentStudents =
        [...students]
            .sort(
                function (a, b) {

                    return (
                        Number(b.id) -
                        Number(a.id)
                    );

                }
            )
            .slice(0, 4);


    // =================================
    // DISPLAY EACH STUDENT
    // =================================

    recentStudents.forEach(
        function (student) {

            const row =
                document.createElement(
                    "tr"
                );


            // =================================
            // STUDENT NAME
            // =================================

            const name =
                student.name || "";


            const nameParts =
                name
                    .trim()
                    .split(/\s+/);


            // =================================
            // INITIALS
            // =================================

            let initials = "";


            if (
                nameParts.length >= 2
            ) {

                initials =
                    nameParts[0]
                        .charAt(0)
                        .toUpperCase()
                    +
                    nameParts[1]
                        .charAt(0)
                        .toUpperCase();

            } else {

                initials =
                    name
                        .charAt(0)
                        .toUpperCase();

            }


            // =================================
            // FIND STUDENT RESULTS
            // =================================

            const studentResults =
                results.filter(
                    function (result) {

                        return Number(
                            result.student_id
                        ) === Number(
                            student.id
                        );

                    }
                );


            // =================================
            // CALCULATE STUDENT AVERAGE
            // =================================

            let studentAverage = null;


            if (
                studentResults.length > 0
            ) {

                const totalMarks =
                    studentResults.reduce(
                        function (
                            total,
                            result
                        ) {

                            return (
                                total +
                                Number(
                                    result.marks
                                )
                            );

                        },
                        0
                    );


                studentAverage =
                    totalMarks /
                    studentResults.length;

            }


            // =================================
            // FORMAT AVERAGE
            // =================================

            let averageDisplay = "—";


            if (
                studentAverage !== null &&
                !Number.isNaN(
                    studentAverage
                )
            ) {

                averageDisplay =
                    `${studentAverage.toFixed(1)}%`;

            }


            // =================================
            // CREATE TABLE ROW
            // =================================

            row.innerHTML = `

                <td>

                    <div class="student-info">

                        <div class="student-avatar">

                            ${initials}

                        </div>


                        <div>

                            <strong>
                                ${student.name}
                            </strong>


                            <small>
                                ${student.gender}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${student.student_id}
                </td>


                <td>
                    ${student.student_class}
                </td>


                <td>
                    ${averageDisplay}
                </td>


                <td>

                    <span class="status active">

                        Active

                    </span>

                </td>

            `;


            recentStudentsBody.appendChild(
                row
            );

        }
    );

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
// START DASHBOARD
// =================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

        loadRecentStudents();

    }
);