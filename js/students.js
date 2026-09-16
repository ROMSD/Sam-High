const studentsCurrentUser =
    JSON.parse(localStorage.getItem("currentUser"));

const studentsAuthToken =
    localStorage.getItem("authToken");

if (!studentsCurrentUser || !studentsAuthToken) {
    window.location.href = "login.html";
}

// API
const STUDENTS_API =
    "http://localhost:3000/api/students";


// Authentication headers
function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${studentsAuthToken}`
    };
}


// HTML elements
const openModalBtn =
    document.getElementById("openModalBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const studentModal =
    document.getElementById("studentModal");

const studentForm =
    document.getElementById("studentForm");

const studentsTableBody =
    document.getElementById("studentsTableBody");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const studentCount =
    document.getElementById("studentCount");

const modalTitle =
    document.getElementById("modalTitle");


// Store students
let students = [];

let editingStudentId = null;


// ==============================
// OPEN MODAL
// ==============================

function openStudentModal() {

    editingStudentId = null;

    modalTitle.textContent =
        "Add Student";

    studentForm.reset();

    // IMPORTANT:
    // Your CSS uses .modal.show
    studentModal.classList.add("show");
}


// ==============================
// CLOSE MODAL
// ==============================

function closeStudentModal() {

    studentModal.classList.remove("show");

    studentForm.reset();

    editingStudentId = null;

    modalTitle.textContent =
        "Add Student";
}


// Open modal buttons
if (openModalBtn) {

    openModalBtn.addEventListener(
        "click",
        openStudentModal
    );
}


if (emptyAddBtn) {

    emptyAddBtn.addEventListener(
        "click",
        openStudentModal
    );
}


// Close modal buttons
if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeStudentModal
    );
}


if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeStudentModal
    );
}


// ==============================
// LOAD STUDENTS
// ==============================

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


        // Token expired/invalid
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


        displayStudents(students);


    } catch (error) {

        console.error(
            "Load students error:",
            error
        );

        alert(
            "Unable to load students."
        );
    }
}


// ==============================
// DISPLAY STUDENTS
// ==============================

function displayStudents(list) {

    studentsTableBody.innerHTML = "";


    // Update student count
    if (studentCount) {

        studentCount.textContent =
            `${list.length} ${
                list.length === 1
                    ? "Student"
                    : "Students"
            }`;
    }


    // No students
    if (list.length === 0) {

        emptyState.style.display =
            "block";

        return;
    }


    emptyState.style.display =
        "none";


    // Add students to table
    list.forEach(
        function(student) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${student.name}</td>

                <td>${student.student_id}</td>

                <td>${student.student_class}</td>

                <td>${student.gender}</td>

                <td>
                    <button
                        type="button"
                        onclick="editStudent(${student.id})">
                        Edit
                    </button>

                    <button
                        type="button"
                        onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                </td>
            `;


            studentsTableBody.appendChild(
                row
            );
        }
    );
}


// ==============================
// ADD / EDIT STUDENT
// ==============================

studentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("studentName")
                .value
                .trim();


        const studentId =
            document
                .getElementById("studentId")
                .value
                .trim();


        const studentClass =
            document
                .getElementById("studentClass")
                .value;


        const gender =
            document
                .getElementById("studentGender")
                .value;


        // Validation
        if (
            !name ||
            !studentId ||
            !studentClass ||
            !gender
        ) {

            alert(
                "Please fill in all fields."
            );

            return;
        }


        try {

            let response;


            // EDIT
            if (editingStudentId) {

                response =
                    await fetch(
                        `${STUDENTS_API}/${editingStudentId}`,
                        {
                            method: "PUT",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({
                                    name:
                                        name,

                                    studentId:
                                        studentId,

                                    studentClass:
                                        studentClass,

                                    gender:
                                        gender
                                })
                        }
                    );

            }

            // ADD
            else {

                response =
                    await fetch(
                        STUDENTS_API,
                        {
                            method: "POST",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({
                                    name:
                                        name,

                                    studentId:
                                        studentId,

                                    studentClass:
                                        studentClass,

                                    gender:
                                        gender
                                })
                        }
                    );
            }


            // Authentication error
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
                    data.message ||
                    "Failed to save student."
                );

                return;
            }


            if (editingStudentId) {

                alert(
                    "Student updated successfully."
                );

            } else {

                alert(
                    "Student added successfully."
                );
            }


            closeStudentModal();


            // Reload students
            loadStudents();

        } catch (error) {

            console.error(
                "Save student error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }
    }
);


// ==============================
// EDIT STUDENT
// ==============================

function editStudent(id) {

    const student =
        students.find(
            function(item) {

                return Number(item.id) ===
                    Number(id);
            }
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;
    }


    editingStudentId =
        student.id;


    modalTitle.textContent =
        "Edit Student";


    document
        .getElementById("studentName")
        .value =
            student.name;


    document
        .getElementById("studentId")
        .value =
            student.student_id;


    document
        .getElementById("studentClass")
        .value =
            student.student_class;


    document
        .getElementById("studentGender")
        .value =
            student.gender;


    // IMPORTANT:
    // CSS is .modal.show
    studentModal.classList.add("show");
}


// ==============================
// DELETE STUDENT
// ==============================

async function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {

        return;
    }


    try {

        const response =
            await fetch(
                `${STUDENTS_API}/${id}`,
                {
                    method: "DELETE",

                    headers:
                        getAuthHeaders()
                }
            );


        // Authentication error
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
                data.message ||
                "Failed to delete student."
            );

            return;
        }


        alert(
            "Student deleted successfully."
        );


        loadStudents();


    } catch (error) {

        console.error(
            "Delete student error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// ==============================
// SEARCH STUDENTS
// ==============================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const filtered =
                students.filter(
                    function(student) {

                        return (

                            student.name
                                .toLowerCase()
                                .includes(search)

                            ||

                            student.student_id
                                .toLowerCase()
                                .includes(search)

                        );
                    }
                );


            displayStudents(filtered);
        }
    );
}


// ==============================
// LOGOUT
// ==============================

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


// ==============================
// INITIAL LOAD
// ==============================

loadStudents();