
// =================================
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
// EDIT INDEX
// =================================

let editResultIndex = -1;


// =================================
// ELEMENTS
// =================================

const resultModal =
    document.getElementById("resultModal");

const resultForm =
    document.getElementById("resultForm");

const studentSelect =
    document.getElementById("studentSelect");

const subjectSelect =
    document.getElementById("subjectSelect");

const marksInput =
    document.getElementById("marks");

const percentageDisplay =
    document.getElementById("percentageDisplay");

const gradeDisplay =
    document.getElementById("gradeDisplay");

const modalTitle =
    document.getElementById("modalTitle");

const resultsTableBody =
    document.getElementById("resultsTableBody");

const emptyState =
    document.getElementById("emptyState");


// =================================
// LOAD STUDENTS
// =================================

async function loadStudents() {

    try {

        const response =
            await fetch(
                STUDENTS_API,
                {
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


        renderResults();

        updateStatistics();


    } catch (error) {

        console.error(
            "Error loading results:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// =================================
// OPEN RESULT MODAL
// =================================

async function openResultModal(
    index = -1
) {

    // Load current students and subjects

    await loadStudents();

    await loadSubjects();


    // Check students

    if (students.length === 0) {

        alert(
            "Please add at least one student first."
        );

        return;

    }


    // Check subjects

    if (subjects.length === 0) {

        alert(
            "Please add at least one subject first."
        );

        return;

    }


    editResultIndex =
        index;


    // Populate dropdowns

    populateStudents();

    populateSubjects();


    // =================================
    // ADD
    // =================================

    if (index === -1) {

        modalTitle.textContent =
            "Add Result";


        resultForm.reset();


        percentageDisplay.textContent =
            "0%";


        gradeDisplay.textContent =
            "-";

    }


    // =================================
    // EDIT
    // =================================

    else {

        modalTitle.textContent =
            "Edit Result";


        const result =
            results[index];


        studentSelect.value =
            result.student_id;


        subjectSelect.value =
            result.subject_id;


        marksInput.value =
            result.marks;


        updateCalculation(
            result.marks
        );

    }


    resultModal.classList.add(
        "show"
    );

}


// =================================
// CLOSE RESULT MODAL
// =================================

function closeResultModal() {

    resultModal.classList.remove(
        "show"
    );


    resultForm.reset();


    percentageDisplay.textContent =
        "0%";


    gradeDisplay.textContent =
        "-";


    editResultIndex =
        -1;

}


// =================================
// POPULATE STUDENTS
// =================================

function populateStudents() {

    studentSelect.innerHTML = `

        <option value="">
            Select student
        </option>

    `;


    students.forEach(
        function(student) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =
                `${student.name} (${student.student_id})`;


            studentSelect.appendChild(
                option
            );

        }
    );

}


// =================================
// POPULATE SUBJECTS
// =================================

function populateSubjects() {

    subjectSelect.innerHTML = `

        <option value="">
            Select subject
        </option>

    `;


    subjects.forEach(
        function(subject) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                subject.id;


            option.textContent =
                `${subject.name} (${subject.code})`;


            subjectSelect.appendChild(
                option
            );

        }
    );

}


// =================================
// CALCULATE GRADE
// =================================

function calculateGrade(mark) {

    mark =
        Number(mark);


    if (mark >= 80) {

        return "A";

    }


    if (mark >= 70) {

        return "B";

    }


    if (mark >= 60) {

        return "C";

    }


    if (mark >= 50) {

        return "D";

    }


    return "F";

}


// =================================
// UPDATE CALCULATION
// =================================

function updateCalculation(mark) {

    if (
        mark === "" ||
        mark === null
    ) {

        percentageDisplay.textContent =
            "0%";


        gradeDisplay.textContent =
            "-";


        return;

    }


    mark =
        Number(mark);


    if (
        mark < 0 ||
        mark > 100
    ) {

        percentageDisplay.textContent =
            "Invalid";


        gradeDisplay.textContent =
            "-";


        return;

    }


    const grade =
        calculateGrade(mark);


    percentageDisplay.textContent =
        `${mark}%`;


    gradeDisplay.textContent =
        grade;

}


// =================================
// MARK INPUT
// =================================

marksInput.addEventListener(
    "input",
    function() {

        updateCalculation(
            this.value
        );

    }
);


// =================================
// SAVE RESULT
// =================================

resultForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const studentId =
            Number(
                studentSelect.value
            );


        const subjectId =
            Number(
                subjectSelect.value
            );


        const marks =
            Number(
                marksInput.value
            );


        // =================================
        // VALIDATION
        // =================================

        if (!studentId) {

            alert(
                "Please select a student."
            );

            return;

        }


        if (!subjectId) {

            alert(
                "Please select a subject."
            );

            return;

        }


        if (
            isNaN(marks) ||
            marks < 0 ||
            marks > 100
        ) {

            alert(
                "Mark must be between 0 and 100."
            );

            return;

        }


        // =================================
        // ADD RESULT
        // =================================

        if (
            editResultIndex === -1
        ) {

            try {

                const response =
                    await fetch(
                        RESULTS_API,
                        {

                            method: "POST",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({

                                    studentId:
                                        studentId,

                                    subjectId:
                                        subjectId,

                                    marks:
                                        marks

                                })

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


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message
                    );

                    return;

                }


                alert(
                    "Result added successfully."
                );


                closeResultModal();


                await loadResults();


            } catch (error) {

                console.error(
                    "Error adding result:",
                    error
                );


                alert(
                    "Unable to connect to the server."
                );

            }

        }


        // =================================
        // EDIT RESULT
        // =================================

        else {

            const result =
                results[
                    editResultIndex
                ];


            try {

                const response =
                    await fetch(
                        `${RESULTS_API}/${result.id}`,
                        {

                            method: "PUT",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({

                                    studentId:
                                        studentId,

                                    subjectId:
                                        subjectId,

                                    marks:
                                        marks

                                })

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


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message
                    );

                    return;

                }


                alert(
                    "Result updated successfully."
                );


                closeResultModal();


                await loadResults();


            } catch (error) {

                console.error(
                    "Error updating result:",
                    error
                );


                alert(
                    "Unable to connect to the server."
                );

            }

        }

    }
);


// =================================
// RENDER RESULTS
// =================================

function renderResults(
    searchTerm = ""
) {

    resultsTableBody.innerHTML =
        "";


    const filteredResults =
        results.filter(
            function(result) {

                const searchText = `

                    ${result.student_name}

                    ${result.student_number}

                    ${result.subject_name}

                    ${result.subject_code}

                `.toLowerCase();


                return searchText.includes(
                    searchTerm.toLowerCase()
                );

            }
        );


    // =================================
    // EMPTY STATE
    // =================================

    if (
        filteredResults.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    filteredResults.forEach(
        function(result) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${result.student_name}
                </td>

                <td>
                    ${result.student_number}
                </td>

                <td>
                    ${result.subject_name}
                </td>

                <td>
                    ${result.subject_code}
                </td>

                <td>
                    ${result.marks}%
                </td>

                <td>

                    <span
                        class="grade ${getGradeClass(result.grade)}"
                    >

                        ${result.grade}

                    </span>

                </td>

                <td>

                    <button
                        class="action-btn edit-btn"
                        onclick="editResult(${results.indexOf(result)})"
                    >

                        Edit

                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteResult(${results.indexOf(result)})"
                    >

                        Delete

                    </button>

                </td>

            `;


            resultsTableBody.appendChild(
                row
            );

        }
    );

}


// =================================
// GRADE CSS CLASS
// =================================

function getGradeClass(grade) {

    if (grade === "A") {

        return "grade-a";

    }


    if (grade === "B") {

        return "grade-b";

    }


    if (grade === "C") {

        return "grade-c";

    }


    if (grade === "D") {

        return "grade-d";

    }


    return "grade-f";

}


// =================================
// EDIT RESULT
// =================================

function editResult(index) {

    openResultModal(index);

}


// =================================
// DELETE RESULT
// =================================

async function deleteResult(index) {

    const result =
        results[index];


    const confirmed =
        confirm(
            "Are you sure you want to delete this result?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${RESULTS_API}/${result.id}`,
                {

                    method: "DELETE",

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


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;

        }


        alert(
            "Result deleted successfully."
        );


        await loadResults();


    } catch (error) {

        console.error(
            "Error deleting result:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// =================================
// SEARCH
// =================================

function searchResults() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    renderResults(
        searchInput.value
    );

}


// =================================
// UPDATE STATISTICS
// =================================

function updateStatistics() {

    const totalResults =
        document.getElementById(
            "totalResults"
        );


    const averageMark =
        document.getElementById(
            "averageMark"
        );


    const passRate =
        document.getElementById(
            "passRate"
        );


    totalResults.textContent =
        results.length;


    if (
        results.length === 0
    ) {

        averageMark.textContent =
            "0%";


        passRate.textContent =
            "0%";


        return;

    }


    // =================================
    // TOTAL MARKS
    // =================================

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


    // =================================
    // AVERAGE
    // =================================

    const average =
        totalMarks /
        results.length;


    averageMark.textContent =
        `${average.toFixed(1)}%`;


    // =================================
    // PASSED RESULTS
    // =================================

    const passedResults =
        results.filter(
            function(result) {

                return (
                    Number(result.marks) >= 50
                );

            }
        );


    const passPercentage =
        (
            passedResults.length /
            results.length
        ) * 100;


    passRate.textContent =
        `${passPercentage.toFixed(1)}%`;

}


// =================================
// CLOSE MODAL OUTSIDE
// =================================

window.addEventListener(
    "click",
    function(event) {

        if (
            event.target === resultModal
        ) {

            closeResultModal();

        }

    }
);


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
// INITIALIZE
// =================================

async function initialize() {

    await loadStudents();

    await loadSubjects();

    await loadResults();

}


initialize();