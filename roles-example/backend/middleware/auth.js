const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('users.json');
const database = lowdb(adapter);

function admin(request, response, next) {
  const loggedInId = request.cookies.loggedIn;
  console.log('admin cookies', loggedInId);
  try {
    const user = database.get('accounts').find({ id: loggedInId }).value();
    console.log('admin middleware', user);
    if (!user) {
      throw new Error(); //Kommer istället att hoppa in i catchen nedan
    } else if (user.role !== 'admin') {
      throw new Error(); //Kommer istället att hoppa in i catchen nedan
    } else {
      next(); //Gå vidare till nästa callback i endpoint:en
    }
  } catch (error) {
    response.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

exports.admin = admin;