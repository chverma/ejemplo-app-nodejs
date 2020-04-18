var models  = require('../models');
// Drop users
models.UserApp.truncate().then(() => {
  // Create Admin user with password
  models.UserApp.create({
    username: 'admin',
    password: '1234',
    role: 'admin'
  }).then((res) => {
    console.log("User admin created.");
  });
});
