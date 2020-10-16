
const form = document.querySelector('form');
const firstNameError = document.querySelector('.firstName.error');
const lastNameError = document.querySelector('.lastName.error');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    firstNameError.textContent = '';
    lastNameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';

    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const res = await fetch('/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({firstName, lastName, email, password})
        });
        const data = await res.json();
        if (data.errors) {
            firstNameError.textContent = data.errors.firstName;
            lastNameError.textContent = data.errors.lastName;
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        }
        if (data.user) {
            location.assign('/profile');
        }
    } catch (err) {
        console.log(err);
    }
})