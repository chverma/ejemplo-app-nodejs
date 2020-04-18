var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var Acl       = require('acl');
var AclSeq    = require('acl-sequelize');
var db        = require('./models/index.js').sequelize;
var acl       = new Acl(new AclSeq(db, { prefix: 'acl_' }));

// Redis
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();

// Define role permissions
require('./scripts/define_role_permissions')(acl);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl : 260 }),
    saveUninitialized: false,
    resave: false
}));

// Add login route before acl middleware
app.use('/login', loginRouter(acl));

// Add public directory before acl middleware
app.use(express.static(path.join(__dirname, 'public')));

// Add ACL middleware before protected routes
const NUM_PATH_COMPONENTS = 1;
function checkForPermissions() {
  return acl.middleware(NUM_PATH_COMPONENTS, getUserId);
}

function getUserId(req) {
  if (req.session && req.session.user) {
    return req.session.user.id;
  }
}
app.use(checkForPermissions());
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // User not authenticated
  if (err.errorCode == 401) {
    res.redirect("/login");
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
