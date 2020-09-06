class Form {
    constructor(formType) {
        this.formType = formType;
    }

    submitForm = e => {
        alert("This Functionality is in Progress");
        document.getElementById("login").reset();
    }

    renderHtml() {
        if (this.formType !== "login") {
            document.getElementById("tab_ware").innerText = `Create Account`;
        }
        const buttonText = this.formType === "login" && "Let's Login" || "Create Account";
        const formHeading = this.formType === "login" && "Login" || "Create";
        const link = this.formType !== "login" && "login" || "createAccount";
        const linkText = this.formType !== "login" && "Login" || "Create";
        let template = '<div class="form">';
        template += `<div>${formHeading} Account</div>`;
        template += `<form id="login" autocomplete="off">`;
        template += '<p><input name="id" type="email" value="" placeholder="Email..." maxlength="20" required></p>';
        if (this.formType === "login") {
            template += '<p><input name="password" type="password" placeholder="Password" maxlength="20" value="" required></p>';
        } else {
            template += '<p><input name="Name" type="text" placeholder="Name..." value="" maxlength="20" required></p>';
        }

        template += `<p><button type="submit">${buttonText}</button></p>`;
        template += `<p><a href="#${link}">${linkText} Account</a></p>`;
        template += '</form>';
        template += '</div>';
        document.getElementById("content").innerHTML = template;
        document.getElementById("login")
            .addEventListener("submit", (e) => {
                e.preventDefault();
                this.submitForm(e);
            });
    }
}