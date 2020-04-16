var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', (req, res) => {
  models.User.create({
    username: req.body.username
  }).then(() => {
    res.redirect('/');
  });
});

router.get('/:user_id/destroy', (req, res) => {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(() => {
    res.redirect('/');
  });
});

router.post('/:user_id/tasks/create', (req, res) => {
  models.Task.create({
    title: req.body.title,
    UserId: req.params.user_id
  }).then(() => {
    res.redirect('/');
  });
});

router.get('/:user_id/tasks/:task_id/destroy', (req, res) => {
  models.Task.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(() => {
    res.redirect('/');
  });
});


module.exports = router;
