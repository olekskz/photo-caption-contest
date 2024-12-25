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
        const response = await fetch('http://localhost:3001/auth/login', { // Updated the route to match the router
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
            messageBox.textContent = errorData.message;  
        }
    } catch (err) {
        console.error(err);
        messageBox.textContent = 'Network or server issue';
    }
});
