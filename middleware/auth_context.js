const SESSION_COOKIE_NAME = 'microblog';
/**
 * Adds auth contexts __authContext and __pageContext to the request.
 * __authContext contains values related to user authorization in general, PAGES and API
 * __pageContext has values required for PAGES rendering only
 */
function authContextParser(req, resp, next) {
  //! now, the fact we HAVE this cookie is enough to say it's
  //! a valid, logged in user
  const isLoggedIn = !!req.cookies[SESSION_COOKIE_NAME];

  req.__authContext = {
    isLoggedIn,
  };

  req.__pageContext = {
    isLoggedIn,
  };

  next();
}

/**
 * Creates middleware which makes new user session and then
 * redirects user to a given page (__index__ page by default)
 * @param {string?} redirectTo
 */
function authMakeSessionAndRedirect(redirectTo) {
  return (req, resp) => {
    const cookieOptions = {
      httpOnly: true, // not available to client js
      secure: true, // via HTTPS only (or localhost)
      sameSite: 'strict', // only for req from OUR client to OUR backend
      // strict - auth, sessions...
      // lax - promo blocks, visual sections.. !!! NOT SESSION STATE
    };

    resp.cookie(SESSION_COOKIE_NAME, true, cookieOptions);
    resp.redirect(redirectTo || '/');
  };
}

/**
 * Destroy user session and redirect to index page
 */
function authDestroySession(req, resp) {
  resp.clearCookie(SESSION_COOKIE_NAME);
  resp.redirect('/login');
}

module.exports = {
  authContextParser,
  authMakeSessionAndRedirect,
  authDestroySession,
};
