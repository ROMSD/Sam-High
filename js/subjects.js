// =================================
// ELEMENTS
// =================================
const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "login.html";

}




const subjectModal =
    document.getElementById("subjectModal");

const openSubjectModal =
    document.getElementById("openSubjectModal");

const emptySubjectBtn =
    document.getElementById("emptySubjectBtn");

const closeSubjectModal =
    document.getElementById("closeSubjectModal");

const cancelSubject =
    document.getElementById("cancelSubject");

const subjectForm =
    document.getElementById("subjectForm");

const subjectsTableBody =
    document.getElementById("subjectsTableBody");

const subjectEmpty =
    document.getElementById("subjectEmpty");

const subjectSearch =
    document.getElementById("subjectSearch");

const subjectCount =
    document.getElementById("subjectCount");

const totalSubjects =
    document.getElementById("totalSubjects");

const totalCodes =
    document.getElementById("totalCodes");

const subjectModalTitle =
    document.getElementById("subjectModalTitle");


// =================================
// SUBJECT DATA
// =================================

let subjects =
    JSON.parse(
        localStorage.getItem("subjects")
    ) || [];

let editSubjectIndex = null;


// =================================
// OPEN MODAL
// =================================

function openModal() {

    subjectModal.classList.add("show");

}


// =================================
// CLOSE MODAL
// =================================

function closeModal() {

    subjectModal.classList.remove("show");

    subjectForm.reset();

    editSubjectIndex = null;

    subjectModalTitle.textContent =
        "Add Subject";

}


// =================================
// BUTTON EVENTS
// =================================

openSubjectModal.addEventListener(
    "click",
    openModal
);


emptySubjectBtn.addEventListener(
    "click",
    openModal
);


closeSubjectModal.addEventListener(
    "click",
    closeModal
);


cancelSubject.addEventListener(
    "click",
    closeModal
);


// =================================
// SAVE SUBJECT
// =================================

subjectForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "subjectName"
            ).value.trim();


        const code =
            document.getElementById(
                "subjectCode"
            ).value.trim().toUpperCase();


        const category =
            document.getElementById(
                "subjectCategory"
            ).value;


        const status =
            document.getElementById(
                "subjectStatus"
            ).value;


        // CHECK FOR DUPLICATE CODE

        const duplicate =
            subjects.some(
                function(subject, index) {

                    return (
                        subject.code === code &&
                        index !== editSubjectIndex
                    );

                }
            );


        if (duplicate) {

            alert(
                "A subject with this code already exists."
            );

            return;

        }


        const subject = {

            name: name,

            code: code,

            category: category,

            status: status

        };


        // EDIT

        if (editSubjectIndex !== null) {

            subjects[editSubjectIndex] =
                subject;

        }

        // ADD

        else {

            subjects.push(subject);

        }


        // SAVE

        localStorage.setItem(
            "subjects",
            JSON.stringify(subjects)
        );


        renderSubjects();

        closeModal();

    }
);


// =================================
// DISPLAY SUBJECTS
// =================================

function renderSubjects() {

    subjectsTableBody.innerHTML = "";


    if (subjects.length === 0) {

        subjectEmpty.style.display =
            "flex";

    }

    else {

        subjectEmpty.style.display =
            "none";

    }


    subjects.forEach(
        function(subject, index) {


            const row = document.createElement(
                "tr"
            );


            row.innerHTML = `

                <td>

                    <div class="subject-name">

                        <div class="subject-icon">
                            📚
                        </div>

                        <strong>
                            ${subject.name}
                        </strong>

                    </div>

                </td>


                <td>
                    <strong>
                        ${subject.code}
                    </strong>
                </td>


                <td class="category">
                    ${subject.category}
                </td>


                <td>

                    <span class="
                        subject-status
                        ${subject.status.toLowerCase()}
                    ">

                        ${subject.status}

                    </span>

                </td>


                <td>

                    <div class="subject-actions">

                        <button
                            class="edit-subject"
                            onclick="editSubject(${index})">

                            Edit

                        </button>


                        <button
                            class="delete-subject"
                            onclick="deleteSubject(${index})">

                            Delete

                        </button>

                    </div>

                </td>

            `;


            subjectsTableBody.appendChild(row);

        }
    );


    updateStatistics();

}


// =================================
// STATISTICS
// =================================

function updateStatistics() {

    totalSubjects.textContent =
        subjects.length;


    totalCodes.textContent =
        subjects.length;


    subjectCount.textContent =
        `${subjects.length} Subject${
            subjects.length === 1
                ? ""
                : "s"
        }`;

}


// =================================
// EDIT
// =================================

function editSubject(index) {

    const subject =
        subjects[index];


    document.getElementById(
        "subjectName"
    ).value =
        subject.name;


    document.getElementById(
        "subjectCode"
    ).value =
        subject.code;


    document.getElementById(
        "subjectCategory"
    ).value =
        subject.category;


    document.getElementById(
        "subjectStatus"
    ).value =
        subject.status;


    editSubjectIndex =
        index;


    subjectModalTitle.textContent =
        "Edit Subject";


    openModal();

}


// =================================
// DELETE
// =================================

function deleteSubject(index) {

    const subject =
        subjects[index];


    const confirmation =
        confirm(
            `Are you sure you want to delete ${subject.name}?`
        );


    if (!confirmation) {

        return;

    }


    subjects.splice(
        index,
        1
    );


    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );


    renderSubjects();

}


// =================================
// SEARCH
// =================================

subjectSearch.addEventListener(
    "input",
    function() {


        const search =
            subjectSearch.value
                .toLowerCase()
                .trim();


        const rows =
            subjectsTableBody.querySelectorAll(
                "tr"
            );


        rows.forEach(
            function(row) {


                const text =
                    row.textContent
                        .toLowerCase();


                if (
                    text.includes(search)
                ) {

                    row.style.display =
                        "";

                }

                else {

                    row.style.display =
                        "none";

                }

            }
        );

    }
);


// =================================
// CLOSE MODAL OUTSIDE
// =================================

subjectModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === subjectModal
        ) {

            closeModal();

        }

    }
);


// =================================
// INITIALIZE
// =================================

renderSubjects();



// ==============================
// Sidebar toggle
// ==============================
const menuBtn = document.getElementById("menuBtn");

const sidebar = document.getElementById("sidebar");


menuBtn.addEventListener("click", function () {

    sidebar.classList.toggle("open");

});