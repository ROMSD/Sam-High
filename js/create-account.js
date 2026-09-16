// =================================
// ELEMENTS
// =================================

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const togglePasswordButton =
    document.getElementById("togglepassword");

const createAccountForm =
    document.getElementById("createAccountForm");

const accountMessage =
    document.getElementById("accountMessage");


// =================================
// API URL
// =================================

const REGISTER_API =
    "http://localhost:3000/api/auth/register";


// =================================
// CREATE ACCOUNT
// =================================

createAccountForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value
                .trim();


        const email =
            document.getElementById("email")
                .value
                .trim();


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        // =================================
        // VALIDATION
        // =================================

        if (!name || !email || !password || !confirmPassword) {

            accountMessage.textContent =
                "Please fill in all fields.";

            accountMessage.style.color =
                "#dc2626";

            return;

        }


        if (password !== confirmPassword) {

            accountMessage.textContent =
                "Passwords do not match.";

            accountMessage.style.color =
                "#dc2626";

            return;

        }


        if (password.length < 6) {

            accountMessage.textContent =
                "Password must be at least 6 characters.";

            accountMessage.style.color =
                "#dc2626";

            return;

        }


        // =================================
        // SEND TO SERVER
        // =================================

        try {

            const response =
                await fetch(
                    REGISTER_API,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                name:
                                    name,

                                email:
                                    email,

                                password:
                                    password

                            })

                    }
                );


            const data =
                await response.json();


            // =================================
            // SERVER ERROR
            // =================================

            if (!response.ok) {

                accountMessage.textContent =
                    data.message ||
                    "Failed to create account.";

                accountMessage.style.color =
                    "#dc2626";

                return;

            }


            // =================================
            // SUCCESS
            // =================================

            accountMessage.textContent =
                "Account created successfully.";

            accountMessage.style.color =
                "#16a34a";


            createAccountForm.reset();


            // =================================
            // REDIRECT TO LOGIN
            // =================================

            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1200
            );


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            accountMessage.textContent =
                "Unable to connect to the server.";

            accountMessage.style.color =
                "#dc2626";

        }

    }
);


// =================================
// PASSWORD VISIBILITY
// =================================

togglePasswordButton.addEventListener(
    "click",
    function() {

        const showingPassword =
            passwordInput.type === "text";


        if (showingPassword) {

            passwordInput.type =
                "password";

            confirmPasswordInput.type =
                "password";

            togglePasswordButton.textContent =
                "Show";

        } else {

            passwordInput.type =
                "text";

            confirmPasswordInput.type =
                "text";

            togglePasswordButton.textContent =
                "Hide";

        }

    }
);