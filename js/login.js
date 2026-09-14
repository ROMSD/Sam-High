const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('togglepassword');
const capsWarning = document.getElementById('capswarning');

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        // GET USERS

        const users =
            JSON.parse(localStorage.getItem("users")) || [];


        // FIND USER

        const user =
            users.find(function(user) {

                return (
                    user.email === email &&
                    user.password === password
                );

            });


        // INVALID LOGIN

        if (!user) {

            loginMessage.textContent =
                "Invalid email or password.";

            loginMessage.style.color = "#dc2626";

            return;
        }


        // SAVE CURRENT USER

        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                name: user.name,
                email: user.email
            })
        );


        // SUCCESS

        loginMessage.textContent =
            "Login successful.";

        loginMessage.style.color = "#16a34a";


        // REDIRECT

        setTimeout(function() {

            window.location.href = "index.html";

        }, 500);

    }
);
toggleButton.addEventListener('click', ()=>{
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword? 'text' : 'password';
    toggleButton.textContent  = isPassword ? 'Hide' : 'Show';
});


function checkCapsLock(event){
    if (event.getModifierState){
        const capsLockIsOn  = event.getModifierState('Caps lock');
        capsWarning.style.display = capsLockIsOn ? 'block' : 'none';
    }
}
passwordInput.addEventListener('keydown', checkCapsLock);
passwordInput.addEventListener('keyup', checkCapsLock);

window.addEventListener('keydown',(e)=>{
    if (document.activeElement === passwordInput){
        checkCapsLock(e);
    }
});