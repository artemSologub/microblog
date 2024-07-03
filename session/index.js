const config = require('config');

const expressSession = require('express-session');
const genFunc = require('connect-pg-simple');

// setup for session ID cookie on
const cookieParams = {
  httpOnly: true,
  sameSite: 'strict',
  secure: config.session.secureCookie,
};
const PostgresqlStore = genFunc(expressSession);

// a storage where session data will be saved
const sessionStore = new PostgresqlStore({
  conString: config.db.defaultDb,
  createTableIfMissing: true,
});

const sessionMddleware = expressSession({
  secret: config.session.secret,
  name: config.session.cookieName,
  cookie: cookieParams,
  saveUninitialized: false,
  resave: false,
  store: sessionStore,
});

module.exports = {
  sessionMddleware,
};
