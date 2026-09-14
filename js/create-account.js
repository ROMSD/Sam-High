const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('togglepassword');
const confirmPassword = document.getElementById('confirmPassword');

const createAccountForm =
    document.getElementById("createAccountForm");

const accountMessage =
    document.getElementById("accountMessage");


createAccountForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // GET EXISTING USERS

        let users =
            JSON.parse(localStorage.getItem("users")) || [];


        // CHECK PASSWORDS

        if (password !== confirmPassword) {

            accountMessage.textContent =
                "Passwords do not match.";

            accountMessage.style.color = "#dc2626";

            return;
        }


        // CHECK IF EMAIL EXISTS

        const existingUser =
            users.find(function(user) {

                return user.email === email;

            });


        if (existingUser) {

            accountMessage.textContent =
                "An account with this email already exists.";

            accountMessage.style.color = "#dc2626";

            return;
        }


        // CREATE USER

        const newUser = {

            name: name,

            email: email,

            password: password

        };


        users.push(newUser);


        // SAVE

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // SUCCESS MESSAGE

        accountMessage.textContent =
            "Account created successfully.";

        accountMessage.style.color = "#16a34a";


        // CLEAR FORM

        createAccountForm.reset();


        // REDIRECT TO LOGIN

        setTimeout(function() {

            window.location.href = "login.html";

        }, 1200);

    }
);
toggleButton.addEventListener('click', ()=>{
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword? 'text' : 'password';
    toggleButton.textContent  = isPassword ? 'Hide' : 'Show';
});
toggleButton.addEventListener('click', ()=>{
    const isPassword = confirmPassword.type === 'password';
    confirmPassword.type = isPassword? 'text' : 'password';
    toggleButton.textContent  = isPassword ? 'Hide' : 'Show';
});