
const loginForm = document.querySelector('.login-form');
const messageBox = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const password = document.querySelector('.password-input').value;
    const username = document.querySelector('.username-input').value;

    const data = {
        username: username,
        password: password,
    };

    try {
        const response = await fetch('/auth/login', { // Updated the route to match the router
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (response.ok) {
            window.location.href = result.redirectUrl;
        } else {
            document.getElementById('message').textContent = result.message;
        }
    } catch (err) {
        console.error('Error loginning:', err);
        messageBox.textContent = 'Error loginning';
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
