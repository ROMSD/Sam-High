// ==============================
// GET HTML ELEMENTS
// ==============================

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


// ==============================
// STUDENT DATA
// ==============================

let students =
    JSON.parse(localStorage.getItem("students")) || [];

let editIndex = null;


// ==============================
// OPEN MODAL
// ==============================

function openModal() {

    studentModal.classList.add("show");

}


// ==============================
// CLOSE MODAL
// ==============================

function closeModal() {

    studentModal.classList.remove("show");

    studentForm.reset();

    editIndex = null;

    modalTitle.textContent = "Add Student";

}


// OPEN BUTTONS

openModalBtn.addEventListener(
    "click",
    openModal
);


emptyAddBtn.addEventListener(
    "click",
    openModal
);


// CLOSE BUTTONS

closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelBtn.addEventListener(
    "click",
    closeModal
);


// ==============================
// SAVE STUDENT
// ==============================

studentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("studentName").value;

        const id =
            document.getElementById("studentId").value;

        const studentClass =
            document.getElementById("studentClass").value;

        const gender =
            document.getElementById("studentGender").value;


        const student = {

            name: name,

            id: id,

            studentClass: studentClass,

            gender: gender

        };


        // EDIT EXISTING STUDENT

        if (editIndex !== null) {

            students[editIndex] = student;

        }

        // ADD NEW STUDENT

        else {

            students.push(student);

        }


        // SAVE TO LOCAL STORAGE

        localStorage.setItem(

            "students",

            JSON.stringify(students)

        );


        // UPDATE TABLE

        renderStudents();


        // CLOSE MODAL

        closeModal();

    }
);


// ==============================
// DISPLAY STUDENTS
// ==============================

function renderStudents() {


    studentsTableBody.innerHTML = "";


    // EMPTY STATE

    if (students.length === 0) {

        emptyState.style.display = "flex";

    }

    else {

        emptyState.style.display = "none";

    }


    students.forEach(

        function (student, index) {


            const initials =
                student.name
                    .split(" ")
                    .map(
                        function (word) {

                            return word[0];

                        }
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();


            const row = `

                <tr>

                    <td>

                        <div class="student-name">

                            <div class="student-avatar">

                                ${initials}

                            </div>


                            <strong>

                                ${student.name}

                            </strong>

                        </div>

                    </td>


                    <td>

                        ${student.id}

                    </td>


                    <td>

                        ${student.studentClass}

                    </td>


                    <td>

                        ${student.gender}

                    </td>


                    <td>

                        <div class="action-buttons">

                            <button
                                class="edit-btn"
                                onclick="editStudent(${index})">

                                Edit

                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteStudent(${index})">

                                Delete

                            </button>

                        </div>

                    </td>

                </tr>

            `;


            studentsTableBody.innerHTML += row;

        }

    );


    studentCount.textContent =
        `${students.length} Student${
            students.length === 1 ? "" : "s"
        }`;

}


// ==============================
// EDIT STUDENT
// ==============================

function editStudent(index) {


    const student =
        students[index];


    document.getElementById(
        "studentName"
    ).value =
        student.name;


    document.getElementById(
        "studentId"
    ).value =
        student.id;


    document.getElementById(
        "studentClass"
    ).value =
        student.studentClass;


    document.getElementById(
        "studentGender"
    ).value =
        student.gender;


    editIndex = index;


    modalTitle.textContent =
        "Edit Student";


    openModal();

}


// ==============================
// DELETE STUDENT
// ==============================

function deleteStudent(index) {


    const confirmDelete =
        confirm(
            `Are you sure you want to delete ${students[index].name}?`
        );


    if (confirmDelete) {


        students.splice(
            index,
            1
        );


        localStorage.setItem(

            "students",

            JSON.stringify(students)

        );


        renderStudents();

    }

}


// ==============================
// SEARCH STUDENTS
// ==============================

searchInput.addEventListener(
    "input",
    function () {


        const searchValue =
            searchInput.value.toLowerCase();


        const rows =
            studentsTableBody.querySelectorAll("tr");


        rows.forEach(
            function (row) {


                const text =
                    row.textContent.toLowerCase();


                if (
                    text.includes(searchValue)
                ) {

                    row.style.display = "";

                }

                else {

                    row.style.display = "none";

                }

            }
        );

    }
);


// ==============================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==============================

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "login.html";

}



studentModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === studentModal
        ) {

            closeModal();

        }

    }
);


// ==============================
// INITIAL DISPLAY
// ==============================


// ==============================
// Sidebar toggle
// ==============================
const menuBtn = document.getElementById("menuBtn");

const sidebar = document.getElementById("sidebar");


menuBtn.addEventListener("click", function () {

    sidebar.classList.toggle("open");

});