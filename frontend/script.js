const API_BASE = "/api";
let token = localStorage.getItem("token");

// DOM Elements
const newPostDiv = document.getElementById("newPost");
const feedDiv = document.getElementById("feed");
const postsContainer = document.getElementById("posts");

function showLoggedInUI() {
  document.getElementById("auth").style.display = "none";
  newPostDiv.style.display = "block";
  feedDiv.style.display = "block";
  fetchPosts();
}

function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
    .then(res => res.json())
    .then(data => {
      alert("Registration successful!");
    })
    .catch(err => console.error(err));
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        token = data.token;
        localStorage.setItem("token", token);
        showLoggedInUI();
      } else {
        alert("Login failed");
      }
    })
    .catch(err => console.error(err));
}

function createPost() {
  const content = document.getElementById("postContent").value;

  fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })
    .then(res => res.json())
    .then(post => {
      document.getElementById("postContent").value = "";
      fetchPosts();
    })
    .catch(err => console.error(err));
}

function fetchPosts() {
  fetch(`${API_BASE}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(posts => {
      postsContainer.innerHTML = "";
      posts.reverse().forEach(post => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.innerHTML = `
          <p><strong>${post.author?.name || "Anonymous"}:</strong> ${post.content}</p>
          <small>${new Date(post.createdAt).toLocaleString()}</small>
        `;
        postsContainer.appendChild(div);
      });
    })
    .catch(err => console.error(err));
}

// Auto login if token exists
if (token) {
  showLoggedInUI();
}


//get post
async function createPost() {
  const content = document.getElementById('postContent').value.trim();
  if (!content) {
    alert('Please enter some content.');
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ content })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Post created!');
      document.getElementById('postContent').value = '';
      fetchPosts(); // Refresh posts list
    } else {
      alert(data.msg || 'Error creating post');
    }
  } catch (err) {
    console.error(err);
    alert('Request failed');
  }
}


//put post
async function createPost() {
  const content = document.getElementById('post-content').value.trim();
  if (!content) {
    alert('Please enter some content.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to create a post.');
    return;
  }

  const res = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ content })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Post created!');
    document.getElementById('post-content').value = '';
    // Optionally reload posts to show the new one
    // fetchMyPosts(); 
  } else {
    alert(data.msg || 'Error creating post');
  }
}

