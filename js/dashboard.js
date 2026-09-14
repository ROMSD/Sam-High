const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {

    window.location.href = "login.html";

}



const menuBtn = document.getElementById("menuBtn");

const sidebar = document.getElementById("sidebar");


menuBtn.addEventListener("click", function () {

    sidebar.classList.toggle("open");

});
const loggedInUser =
    document.getElementById("loggedInUser");

const profileIcon =
    document.getElementById("profileIcon");


if (currentUser) {

    loggedInUser.textContent =
        currentUser.name;


    profileIcon.textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();

}
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";

}