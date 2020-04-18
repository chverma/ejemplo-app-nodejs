var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', (req, res) => {
  models.User.findAll({
    include: [ models.Task ]
  }).then((users) => {
    res.render('index', {
      title: 'Añadir usuario',
      users: users,
      username: req.session.user.username
    });
  });
});

module.exports = router;
