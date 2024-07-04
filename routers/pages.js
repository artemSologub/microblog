const express = require('express');
const pagesRouter = express.Router();

const { ValidationError, NotFoundError, AuthError } = require('../errors');
const { authorValidator } = require('../middleware/validators');
const {
  authMakeSessionAndRedirect,
  authDestroySession,
  restrictedResource,
  ROLES,
} = require('../middleware/auth_context');
const {
  logAuthorIn,
  createAuthorAccount,
} = require('../controllers/auth_controller');
const pagesController = require('../controllers/pages_controller');
const formDataParser = express.urlencoded({ extended: false });

async function formErrorHandler(err, req, resp, next) {
  if (err instanceof ValidationError || err instanceof AuthError) {
    console.error(err.message, err);

    req.__pageContext = {
      ...req.__pageContext,
      data: req.body,
      errors: err.errors,
    };

    delete req.__pageContext.data.password; //! never log passwords
    console.info('Saved metadata in context:', req.__pageContext);

    return next(); // yes, we can next() from error handler to NOT error handler middlewares
  }

  // if not validation - it's something bad and unexpected happened
  // triggering next error handler, which shows Server Error page
  next(err);
}

pagesRouter.use(pagesController.addPageContext);

pagesRouter.get(
  '/',
  pagesController.fetchAllPosts,
  pagesController.renderPage('index')
);

pagesRouter
  .route('/my-posts')
  .get(
    restrictedResource([ROLES.user]),
    pagesController.fetchMyPosts,
    pagesController.renderPage('myposts')
  )
  .post(
    formDataParser,
    pagesController.addNewPost,
    formErrorHandler,
    pagesController.renderPage('myposts')
  );

pagesRouter
  .route('/my-posts/:id')
  .delete(pagesController.deletePost, pagesController.renderPage('myposts'));

// pagesRouter.get('/admin-page', (_req, resp) => {
//   resp.render('index', {});
// });

pagesRouter
  .route('/login')
  .get(pagesController.renderPage('login'))
  .post(
    formDataParser,
    authorValidator,
    logAuthorIn,
    authMakeSessionAndRedirect('/'),
    formErrorHandler,
    pagesController.renderPage('login')
  );

pagesRouter
  .route('/signup')
  .get(pagesController.renderPage('signup'))
  .post(
    formDataParser,
    authorValidator,
    createAuthorAccount,
    authMakeSessionAndRedirect('/'),
    formErrorHandler,
    pagesController.renderPage('signup')
  );

pagesRouter.get('/logout', authDestroySession);

// everything not described by routes here above will result in 404 page
pagesRouter.use(pagesController.renderPage('404'));

pagesRouter.use((err, _req, resp, _next) => {
  console.error('Unexpected server error', err);
  resp.render('500');
});

module.exports = {
  pagesRouter,
};
