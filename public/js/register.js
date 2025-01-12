
const messageBox = document.getElementById('message');

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;


    if (password !== confirmPassword) {
        document.getElementById('message').textContent = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = result.redirectUrl;
        } else {
            document.getElementById('message').textContent = result.message;
        }
    } catch (err) {
        console.error('Error registering:', err);
        messageBox.textContent = 'Error registering';
    }
});

document.getElementById('github-button').addEventListener('click', () => {
    window.location.href = '/auth/github';
});

document.getElementById('google-button').addEventListener('click', () => {
    window.location.href = '/auth/google';
});

document.getElementById('facebook-button').addEventListener('click', () => {
    window.location.href = '/auth/facebook';
});