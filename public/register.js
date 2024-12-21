const registerForm = document.querySelector('.register-form');
const loginForm = document.querySelector('.login-form');
const messageBox = document.getElementById('message');



// Обробник для реєстрації
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('.email-input').value;
    const username = document.querySelector('.username-input').value;  // username, а не name
    const password = document.querySelector('.password-input').value;
    const confirmPassword = document.querySelector('.confirm-password-input').value;

    const data = {
        username: username,  // передаємо username
        email: email,
        password: password,
        confirmPassword: confirmPassword,
    };

    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            window.location.href = result.redirectUrl;
        } else {
            const errorData = await response.json();
            messageBox.textContent = errorData.message;  // Відображення повідомлення про помилку
        }
    } catch (error) {
        console.error(error);
        messageBox.textContent = 'Мережевий збій або помилка на сервері';
    }
});



