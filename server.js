const config = require('config');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { pagesRouter } = require('./routers/pages');
const { authContextParser } = require('./middleware/auth_context');

const app = express();

app.listen(config.server.defaultPort, () =>
  console.log(`server is listening on [${config.server.defaultPort}] port`)
);

app.set('view engine', 'pug');
app.use(express.static('static'));

const accessLogger = morgan(':date :method :url :status');
app.use(accessLogger);

app.use(cookieParser()); // we need cookies access everywhere, to be able to protect API and pages routes
app.use(authContextParser);

const jsonBodyParser = express.json();
app.use(jsonBodyParser);

app.use('/', pagesRouter);
