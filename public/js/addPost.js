const addPostForm = document.querySelector('.add-post-form');

addPostForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Запобігає стандартній поведінці форми

    const formData = new FormData(addPostForm); // Створює FormData об'єкт з форми

    fetch('/auth/addPost', {
        method: 'POST',
        body: formData, // Надсилає FormData об'єкт
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error with adding post');
        }
    })
    .then((result) => {
        window.location.href = result.redirectUrl;
    })
    .then(addPostForm.reset())
    .catch((err) => {
        console.log('Error with adding post:', err);
    });
});