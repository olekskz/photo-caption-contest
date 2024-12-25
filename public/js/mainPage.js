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

let currentPage = 1;
const limit = 3;
let isLoading = false;

const loadPosts = async () => {
  if (isLoading) return;
  isLoading = true;

  try {
    const response = await fetch(`/auth/posts?page=${currentPage}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Error fetching posts');
    }

    const data = await response.json();
    const postsContainer = document.querySelector('.posts-container');

    data.posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.classList.add('upper-part');
      
      const postLabel = document.createElement('label');
      postLabel.classList.add('photo-name');
      postLabel.textContent = post.title;

      const postImage = document.createElement('img');
      postImage.src = post.url;
      postImage.alt = post.title;
      
      const postUser = document.createElement('div');
      postUser.classList.add('user-data');

      const userLabel = document.createElement('label');
      userLabel.textContent = "By:";

      const userP = document.createElement('p');
      userP.textContent = post.user.username;

      const hr = document.createElement('hr');

      const lowerPart = document.createElement('div');
      lowerPart.classList.add('lower-part');

      const captionBox = document.createElement('div');
      captionBox.classList.add('caption-box');
      captionBox.ariaPlaceholder = "No captions yet";

      const captionInput = document.createElement('input');
      captionInput.placeholder = "Add caption";

      const addCaptionButton = document.createElement('button');
      addCaptionButton.textContent = "Add";
      addCaptionButton.classList.add('add-caption-button');

      // Append elements to their respective parents
      postUser.append(userLabel, userP);
      lowerPart.append(captionBox, captionInput, addCaptionButton);

      postElement.append(postLabel, postImage, postUser, hr, lowerPart);
      postsContainer.appendChild(postElement);

      // Fetch and display existing captions
      fetch(`/auth/posts/${post.id}/captions`)
        .then(response => response.json())
        .then(captions => {
          captions.forEach(caption => {
            const captionElement = document.createElement('p');
            captionElement.textContent = ` by: ${caption.user.username}         ${caption.text}`;
            captionBox.appendChild(captionElement);
          });
        })
        .catch(err => {
          console.error('Error fetching captions:', err);
        });

      // Toggle caption box expansion
      captionBox.addEventListener('click', () => {
        captionBox.classList.toggle('expanded');
      });

      addCaptionButton.addEventListener('click', async () => {
        try {
          const response = await fetch(`/auth/posts/${post.id}/captions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              caption: captionInput.value,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            const captionElement = document.createElement('p');
            captionElement.textContent = `${result.caption} by: ${result.user.username}`;
            captionBox.appendChild(captionElement);
            captionInput.value = '';
          } else {
            console.log('Error adding caption');
          }
        } catch (err) {
          console.error('Error adding caption:', err);
        }
      });
    });

    currentPage++;
    isLoading = false;
  } catch (err) {
    console.error('Error loading posts:', err);
    isLoading = false;
  }
};

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadPosts();
  }
};

document.addEventListener('scroll', handleScroll);

// Initial load
loadPosts();