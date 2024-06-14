const { Router } = require('express');
const pagesRouter = Router();

pagesRouter.get('/', (_req, resp) => {
  resp.render('index', {});
});

module.exports = {
  pagesRouter,
};
