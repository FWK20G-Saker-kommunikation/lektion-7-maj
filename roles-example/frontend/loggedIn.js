const nameElem = document.querySelector('#name');
const emailElem = document.querySelector('#email');


async function getAllUsers() {
  const response = await fetch('http://localhost:8000/api/user/all');
  const data = await response.json();

  console.log(data);
}

async function getUserInfo() {
  const response = await fetch('http://localhost:8000/api/user');
  const data = await response.json();

  console.log(data);
  nameElem.innerHTML = `${data.user.firstname} ${data.user.lastname}`;
  emailElem.innerHTML = data.user.email;

  if (data.user.role === 'admin') {
    getAllUsers();
  }
}

async function isLoggedIn() {
  const response = await fetch('http://localhost:8000/api/loggedin');
  const data = await response.json();

  if (data.loggedIn) {
    getUserInfo();
  } else {
    location.href = 'http://localhost:8000/';
  }
}

isLoggedIn();