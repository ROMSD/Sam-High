// =================================
// ELEMENTS
// =================================

const passwordInput =
    document.getElementById("password");

const toggleButton =
    document.getElementById("togglepassword");

const capsWarning =
    document.getElementById("capswarning");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


// =================================
// API URL
// =================================

const LOGIN_API =
    "http://localhost:3000/api/auth/login";


// =================================
// LOGIN
// =================================

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            passwordInput.value;


        // CHECK EMPTY FIELDS
        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            loginMessage.style.color =
                "#dc2626";

            return;
        }


        try {

            const response =
                await fetch(
                    LOGIN_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email:
                                    email,

                                password:
                                    password
                            })
                    }
                );


            const data =
                await response.json();


            // LOGIN FAILED
            if (!response.ok) {

                loginMessage.textContent =
                    data.message ||
                    "Invalid email or password.";

                loginMessage.style.color =
                    "#dc2626";

                return;
            }


            // =================================
            // SAVE JWT TOKEN
            // =================================

            localStorage.setItem(
                "authToken",
                data.token
            );


            // =================================
            // SAVE USER INFORMATION
            // =================================

            localStorage.setItem(
                "currentUser",
                JSON.stringify({
                    id:
                        data.user.id,

                    name:
                        data.user.name,

                    email:
                        data.user.email
                })
            );


            // SUCCESS MESSAGE
            loginMessage.textContent =
                "Login successful.";

            loginMessage.style.color =
                "#16a34a";


            // REDIRECT
            setTimeout(
                function() {

                    window.location.href =
                        "index.html";

                },
                500
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                "Unable to connect to the server.";

            loginMessage.style.color =
                "#dc2626";
        }
    }
);


// =================================
// PASSWORD VISIBILITY
// =================================

toggleButton.addEventListener(
    "click",
    function() {

        const showingPassword =
            passwordInput.type === "text";


        if (showingPassword) {

            passwordInput.type =
                "password";

            toggleButton.textContent =
                "Show";

        } else {

            passwordInput.type =
                "text";

            toggleButton.textContent =
                "Hide";
        }
    }
);


// =================================
// CAPS LOCK DETECTION
// =================================

function checkCapsLock(event) {

    if (!event.getModifierState) {
        return;
    }


    const capsLockIsOn =
        event.getModifierState(
            "CapsLock"
        );


    if (capsLockIsOn) {

        capsWarning.style.display =
            "block";

    } else {

        capsWarning.style.display =
            "none";
    }
}


passwordInput.addEventListener(
    "keydown",
    checkCapsLock
);

passwordInput.addEventListener(
    "keyup",
    checkCapsLock
);

passwordInput.addEventListener(
    "focus",
    function(event) {

        checkCapsLock(event);

    }
);