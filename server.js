const config = require('config');

const express = require('express');
const { pagesRouter } = require('./routers/pages');

const app = express();

app.listen(config.server.defaultPort, () =>
  console.log(`server is listening on [${config.server.defaultPort}] port`)
);

app.set('view engine', 'pug');

const jsonBodyParser = express.json();
app.use(jsonBodyParser);

app.use('/', pagesRouter);
