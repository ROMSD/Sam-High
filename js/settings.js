// CHECK LOGIN

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "login.html";

}


// ELEMENTS

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const topUserName =
    document.getElementById("topUserName");

const topProfileIcon =
    document.getElementById("topProfileIcon");


// DISPLAY CURRENT USER

if (currentUser) {

    profileName.value =
        currentUser.name;

    profileEmail.value =
        currentUser.email;

    topUserName.textContent =
        currentUser.name;

    topProfileIcon.textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();

}


// PROFILE UPDATE

const profileForm =
    document.getElementById("profileForm");

profileForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const newName =
            profileName.value.trim();

        const newEmail =
            profileEmail.value.trim();


        let users =
            JSON.parse(localStorage.getItem("users")) || [];


        const userIndex =
            users.findIndex(function(user) {

                return user.email === currentUser.email;

            });


        if (userIndex === -1) {

            return;

        }


        // UPDATE USER

        users[userIndex].name =
            newName;

        users[userIndex].email =
            newEmail;


        // SAVE USERS

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // UPDATE CURRENT USER

        const updatedUser = {

            name: newName,

            email: newEmail

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(updatedUser)
        );


        // UPDATE UI

        topUserName.textContent =
            newName;

        topProfileIcon.textContent =
            newName
                .charAt(0)
                .toUpperCase();


        // MESSAGE

        const message =
            document.getElementById(
                "profileMessage"
            );

        message.textContent =
            "Profile updated successfully.";

        message.style.color =
            "#16a34a";


    }
);


// CHANGE PASSWORD

const passwordForm =
    document.getElementById("passwordForm");


passwordForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const currentPassword =
            document.getElementById(
                "currentPassword"
            ).value;


        const newPassword =
            document.getElementById(
                "newPassword"
            ).value;


        const confirmNewPassword =
            document.getElementById(
                "confirmNewPassword"
            ).value;


        let users =
            JSON.parse(localStorage.getItem("users")) || [];


        const userIndex =
            users.findIndex(function(user) {

                return user.email === currentUser.email;

            });


        if (userIndex === -1) {

            return;

        }


        const message =
            document.getElementById(
                "passwordMessage"
            );


        // CHECK CURRENT PASSWORD

        if (
            users[userIndex].password !==
            currentPassword
        ) {

            message.textContent =
                "Current password is incorrect.";

            message.style.color =
                "#dc2626";

            return;

        }


        // CHECK NEW PASSWORDS

        if (newPassword !== confirmNewPassword) {

            message.textContent =
                "New passwords do not match.";

            message.style.color =
                "#dc2626";

            return;

        }


        // UPDATE PASSWORD

        users[userIndex].password =
            newPassword;


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        message.textContent =
            "Password changed successfully.";

        message.style.color =
            "#16a34a";


        passwordForm.reset();

    }
);


// CLEAR RESULTS

function clearResults() {

    const confirmed =
        confirm(
            "Delete ALL results? This cannot be undone."
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem("results");


    alert("All results have been deleted.");

}


// CLEAR STUDENTS

function clearStudents() {

    const confirmed =
        confirm(
            "Delete ALL students? This cannot be undone."
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem("students");


    alert("All students have been deleted.");

}


// CLEAR SUBJECTS

function clearSubjects() {

    const confirmed =
        confirm(
            "Delete ALL subjects? This cannot be undone."
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem("subjects");


    alert("All subjects have been deleted.");

}


// RESET APPLICATION

function resetApplication() {

    const confirmed =
        confirm(
            "WARNING: This will delete all users, students, subjects and results. Continue?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.clear();


    alert(
        "Application has been reset."
    );


    window.location.href =
        "login.html";

}


// LOGOUT

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "login.html";

}


// SIDEBAR

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");


menuBtn.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle("open");

    }
);