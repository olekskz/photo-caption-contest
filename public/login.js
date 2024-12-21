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
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            
            window.location.href = '/auth/main'; 
        } else if (response.status === 302) {
            
            const redirectUrl = response.headers.get('Location');
            window.location.href = redirectUrl;
        } else {
            const errorData = await response.json();
            messageBox.textContent = errorData.message;  
        }
    } catch (err) {
        console.error(err);
        messageBox.textContent = 'Network or server issue';
    }
});
