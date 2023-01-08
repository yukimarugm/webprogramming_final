const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Yukio5o6',
  database: 'memo_app'
});

router.get('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    const userId = req.user.id;
    knex("contents")
      .select("*")
      .where({user_id: userId})
      .then(function (results) {
        res.render('index', {
          title: 'Memo App',
          todos: results,
          isAuth: isAuth,
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          title: 'Memo App',
          isAuth: isAuth,
          errorMessage: [err.sqlMessage],
        });
      });
  } else {
    res.render('index', {
      title: 'Memo App',
      isAuth: isAuth,
    });
  }
});

router.post('/', function (req, res, next) {
  // const userId = req.session.userid;
  // const isAuth = Boolean(userId);
  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const todo = req.body.add;
  knex("contents")
    .insert({user_id: userId, content: todo})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'Memo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;