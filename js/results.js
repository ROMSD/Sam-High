// GET DATA FROM LOCAL STORAGE

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "login.html";

}

let students = JSON.parse(localStorage.getItem("students")) || [];
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let results = JSON.parse(localStorage.getItem("results")) || [];


// EDIT INDEX

let editResultIndex = -1;


// ELEMENTS

const resultModal = document.getElementById("resultModal");
const resultForm = document.getElementById("resultForm");

const studentSelect = document.getElementById("studentSelect");
const subjectSelect = document.getElementById("subjectSelect");
const marksInput = document.getElementById("marks");

const percentageDisplay = document.getElementById("percentageDisplay");
const gradeDisplay = document.getElementById("gradeDisplay");

const modalTitle = document.getElementById("modalTitle");

const resultsTableBody =
    document.getElementById("resultsTableBody");

const emptyState =
    document.getElementById("emptyState");


// OPEN MODAL

function openResultModal(index = -1) {

    // Refresh data
    students = JSON.parse(localStorage.getItem("students")) || [];
    subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    // Check if students exist
    if (students.length === 0) {
        alert("Please add at least one student first.");
        return;
    }

    // Check if subjects exist
    if (subjects.length === 0) {
        alert("Please add at least one subject first.");
        return;
    }


    editResultIndex = index;


    // Populate dropdowns
    populateStudents();
    populateSubjects();


    if (index === -1) {

        modalTitle.textContent = "Add Result";

        resultForm.reset();

        percentageDisplay.textContent = "0%";
        gradeDisplay.textContent = "-";

    } else {

        modalTitle.textContent = "Edit Result";

        const result = results[index];

        studentSelect.value = result.studentId;

        subjectSelect.value = result.subjectCode;

        marksInput.value = result.marks;

        updateCalculation(result.marks);
    }


    resultModal.classList.add("show");
}


// CLOSE MODAL

function closeResultModal() {

    resultModal.classList.remove("show");

    resultForm.reset();

    percentageDisplay.textContent = "0%";

    gradeDisplay.textContent = "-";

    editResultIndex = -1;
}


// POPULATE STUDENTS

function populateStudents() {

    studentSelect.innerHTML = `
        <option value="">Select student</option>
    `;


    students.forEach(function(student) {

        const option = document.createElement("option");

        option.value = student.id;

        option.textContent =
            `${student.name} (${student.id})`;

        studentSelect.appendChild(option);

    });
}


// POPULATE SUBJECTS

function populateSubjects() {

    subjectSelect.innerHTML = `
        <option value="">Select subject</option>
    `;


    subjects.forEach(function(subject) {

        const option = document.createElement("option");

        option.value = subject.code;

        option.textContent =
            `${subject.name} (${subject.code})`;

        subjectSelect.appendChild(option);

    });
}


// CALCULATE GRADE

function calculateGrade(mark) {

    mark = Number(mark);


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


// UPDATE CALCULATION

function updateCalculation(mark) {

    if (mark === "" || mark === null) {

        percentageDisplay.textContent = "0%";

        gradeDisplay.textContent = "-";

        return;
    }


    mark = Number(mark);


    if (mark < 0 || mark > 100) {

        percentageDisplay.textContent = "Invalid";

        gradeDisplay.textContent = "-";

        return;
    }


    const grade = calculateGrade(mark);


    percentageDisplay.textContent = `${mark}%`;

    gradeDisplay.textContent = grade;
}


// LISTEN FOR MARK CHANGES

marksInput.addEventListener("input", function() {

    updateCalculation(this.value);

});


// SAVE RESULT

resultForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const studentId = studentSelect.value;

    const subjectCode = subjectSelect.value;

    const marks = Number(marksInput.value);


    // VALIDATION

    if (!studentId) {

        alert("Please select a student.");

        return;
    }


    if (!subjectCode) {

        alert("Please select a subject.");

        return;
    }


    if (marks < 0 || marks > 100 || isNaN(marks)) {

        alert("Mark must be between 0 and 100.");

        return;
    }


    // FIND STUDENT

    const student = students.find(function(student) {

        return student.id === studentId;

    });


    // FIND SUBJECT

    const subject = subjects.find(function(subject) {

        return subject.code === subjectCode;

    });


    if (!student || !subject) {

        alert("Student or subject could not be found.");

        return;
    }


    // CREATE RESULT

    const result = {

        studentId: student.id,

        studentName: student.name,

        subjectCode: subject.code,

        subjectName: subject.name,

        marks: marks,

        percentage: marks,

        grade: calculateGrade(marks)

    };


    // ADD OR EDIT

    if (editResultIndex === -1) {

        results.push(result);

    } else {

        results[editResultIndex] = result;

    }


    // SAVE

    localStorage.setItem(
        "results",
        JSON.stringify(results)
    );


    // CLOSE

    closeResultModal();


    // DISPLAY

    renderResults();

    updateStatistics();

});


// RENDER RESULTS

function renderResults(searchTerm = "") {

    resultsTableBody.innerHTML = "";


    const filteredResults = results.filter(function(result) {

        const searchText = `

            ${result.studentName}
            ${result.studentId}
            ${result.subjectName}
            ${result.subjectCode}

        `.toLowerCase();


        return searchText.includes(
            searchTerm.toLowerCase()
        );

    });


    // EMPTY STATE

    if (filteredResults.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    filteredResults.forEach(function(result) {

        const originalIndex = results.indexOf(result);


        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${result.studentName}</td>

            <td>${result.studentId}</td>

            <td>${result.subjectName}</td>

            <td>${result.subjectCode}</td>

            <td>${result.marks}%</td>

            <td>
                <span class="grade ${getGradeClass(result.grade)}">
                    ${result.grade}
                </span>
            </td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editResult(${originalIndex})"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteResult(${originalIndex})"
                >
                    Delete
                </button>

            </td>

        `;


        resultsTableBody.appendChild(row);

    });

}


// GRADE CSS CLASS

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


// EDIT RESULT

function editResult(index) {

    openResultModal(index);

}


// DELETE RESULT

function deleteResult(index) {

    const confirmed = confirm(
        "Are you sure you want to delete this result?"
    );


    if (!confirmed) {
        return;
    }


    results.splice(index, 1);


    localStorage.setItem(
        "results",
        JSON.stringify(results)
    );


    renderResults();

    updateStatistics();

}


// SEARCH

function searchResults() {

    const searchInput =
        document.getElementById("searchInput");


    renderResults(searchInput.value);

}


// UPDATE STATISTICS

function updateStatistics() {

    const totalResults =
        document.getElementById("totalResults");

    const averageMark =
        document.getElementById("averageMark");

    const passRate =
        document.getElementById("passRate");


    totalResults.textContent =
        results.length;


    if (results.length === 0) {

        averageMark.textContent = "0%";

        passRate.textContent = "0%";

        return;
    }


    // TOTAL MARKS

    const totalMarks = results.reduce(
        function(total, result) {

            return total + Number(result.marks);

        },
        0
    );


    // AVERAGE

    const average =
        totalMarks / results.length;


    averageMark.textContent =
        `${average.toFixed(1)}%`;


    // PASSED RESULTS

    const passedResults =
        results.filter(function(result) {

            return Number(result.marks) >= 50;

        });


    const passPercentage =
        (passedResults.length / results.length) * 100;


    passRate.textContent =
        `${passPercentage.toFixed(1)}%`;

}


// CLOSE MODAL WHEN CLICKING OUTSIDE

window.addEventListener("click", function(event) {

    if (event.target === resultModal) {

        closeResultModal();

    }

});


// SIDEBAR

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


menuBtn.addEventListener("click", function() {

    sidebar.classList.toggle("open");

});


// INITIAL DISPLAY

renderResults();

updateStatistics();