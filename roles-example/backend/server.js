const express = require('express');
const lowdb = require('lowdb');
const cookieParser = require('cookie-parser');
const { nanoid } = require('nanoid');

const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('users.json');
const database = lowdb(adapter);

const { admin } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(express.static('../frontend'));
app.use(cookieParser());

app.post('/api/login', (request, response) => {
  const credentials = request.body;

  const user = database.get('accounts')
                  .find({ username: credentials.username, password: credentials.password })
                  .value();

  let result = { success: false };


  if (user) {
    result.success = true;
    const cookieId = nanoid();

    database.get('accounts')
      .find({ username: credentials.username })
      .assign({ 'id': cookieId })
      .write();

    response.cookie('loggedIn', cookieId);
  }

  response.json(result);
});

app.get('/api/loggedin', (request, response) => {
  //request.cookies visar alla cookies som följer med i ett request
  console.log('cookies', request.cookies);
  const loggedInId = request.cookies.loggedIn;

  const isLoggedIn = database.get('accounts').find({ id: loggedInId }).value();

  let result = { loggedIn: false };

  if (isLoggedIn) {
    result.loggedIn = true;
  }

  response.json(result);
});

app.get('/api/user', (request, response) => {
  const loggedInId = request.cookies.loggedIn;

  const user = database.get('accounts').find({ id: loggedInId }).value();

  let result = { success: false };
  
  if (user) {
    result.success = true;
    result.user = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    }
  }

  response.json(result);
});

app.get('/api/user/all', admin, (request, response) => {
  const allUsers = database.get('accounts').filter({ role: 'user' }).value();

  response.json(allUsers);
});

app.listen(8000, () => {
  console.log('Server started');
});