var models  = require('../models');
var express = require('express');
var router  = express.Router();

function loginRoute(acl) {
  router.get('/', (req, res) => {
      res.render('login');
  });

  router.post('/', (req, res, next) => {
    models.UserApp.findAll({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    }).then((results) => {
      if (results == []) {
        return;
      }
      var user = results[0].dataValues;
      return user;
    }).then((user) => {
      if (user.id) {
      return acl.addUserRoles(user.id, user.role, err => {
        if (err) {
            console.log(err);
        }
        console.log('Added', user.role, 'role to user', user.username, 'with id', user.id);
        req.session.user = user;
        return;
       });
      }
    }).then(() => {
      res.redirect('/');
      return;
    });
  });

  router.get('/close', (req, res) => {
      req.session.destroy();
      return res.redirect('/');
  });  
  return router;
}

module.exports = loginRoute;
