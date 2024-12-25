const logOutButton = document.querySelector('.logout-button'); // Corrected class name

logOutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', { // Ensure the route matches the server route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();
            window.location.href = result.redirectUrl;
        } else {
            console.log('Error with logging out');
        }
    } catch (err) {
        console.log('Error with logging out');
    }
});

