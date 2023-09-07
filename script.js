const form = document.querySelector(".form"),
    iShowHide = document.querySelectorAll(".icon-eye"),
    links = document.querySelectorAll(".link");

iShowHide.forEach(iconEye => {
    iconEye.addEventListener("click", () => {
        let fields = iconEye.parentElement.parentElement.querySelectorAll(".password");

        fields.forEach(password => {
            if (password.type === "password") {
                password.type = "text";
                iconEye.classList.replace("fa-eye-slash","fa-eye");
                return;
            }
               password.type = "password";
               iconEye.classList.replace("fa-eye","fa-eye-slash");
        })
    })

})

