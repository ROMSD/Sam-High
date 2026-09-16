//javascript
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

    return {
        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${authToken}`
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
// ELEMENTS
// =================================

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
// API URL
// =================================

const API_URL =
    "http://localhost:3000/api/subjects";


// =================================
// SUBJECT DATA
// =================================

let subjects = [];

let editSubjectIndex = null;


// =================================
// LOAD SUBJECTS FROM DATABASE
// =================================

async function loadSubjects() {

    try {

        const response =
            await fetch(
                API_URL,
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


        renderSubjects();


    } catch (error) {

        console.error(
            "Error loading subjects:",
            error
        );


        alert(
            "Unable to connect to the server."
        );

    }

}


// =================================
// OPEN MODAL
// =================================

function openModal() {

    subjectModal.classList.add(
        "show"
    );

}


// =================================
// CLOSE MODAL
// =================================

function closeModal() {

    subjectModal.classList.remove(
        "show"
    );

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
    async function(event) {

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


        // =================================
        // ADD SUBJECT
        // =================================

        if (
            editSubjectIndex === null
        ) {

            try {

                const response =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({

                                    name:
                                        name,

                                    code:
                                        code,

                                    category:
                                        category,

                                    status:
                                        status

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
                    "Subject added successfully."
                );


                subjectForm.reset();

                closeModal();

                loadSubjects();


            } catch (error) {

                console.error(
                    "Error adding subject:",
                    error
                );


                alert(
                    "Unable to connect to the server."
                );

            }

        }


        // =================================
        // EDIT SUBJECT
        // =================================

        else {

            const subject =
                subjects[
                    editSubjectIndex
                ];


            try {

                const response =
                    await fetch(
                        `${API_URL}/${subject.id}`,
                        {

                            method: "PUT",

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify({

                                    name:
                                        name,

                                    code:
                                        code,

                                    category:
                                        category,

                                    status:
                                        status

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
                    "Subject updated successfully."
                );


                subjectForm.reset();

                closeModal();

                loadSubjects();


            } catch (error) {

                console.error(
                    "Error updating subject:",
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
// DISPLAY SUBJECTS
// =================================

function renderSubjects() {

    subjectsTableBody.innerHTML = "";


    // =================================
    // EMPTY STATE
    // =================================

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

            const row =
                document.createElement(
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
                            onclick="editSubject(${index})"
                        >

                            Edit

                        </button>


                        <button
                            class="delete-subject"
                            onclick="deleteSubject(${index})"
                        >

                            Delete

                        </button>

                    </div>

                </td>

            `;


            subjectsTableBody.appendChild(
                row
            );

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
// EDIT SUBJECT
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
// DELETE SUBJECT
// =================================

async function deleteSubject(index) {

    const subject =
        subjects[index];


    const confirmation =
        confirm(
            `Are you sure you want to delete ${subject.name}?`
        );


    if (!confirmation) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${subject.id}`,
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
            "Subject deleted successfully."
        );


        loadSubjects();


    } catch (error) {

        console.error(
            "Error deleting subject:",
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

loadSubjects();


// =================================
// SIDEBAR TOGGLE
// =================================

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


menuBtn.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);
