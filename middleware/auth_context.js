const { session: sessionConfig } = require('config');

const ROLES = {
  admin: 'admin',
  user: 'user',
};

/**
 * Creates middleware which makes new user session and then
 * redirects user to a given page (__index__ page by default)
 * @param {string?} redirectTo
 */
function authMakeSessionAndRedirect(redirectTo) {
  return (req, resp) => {
    console.log(
      `Creating session for [${req.__authContext.role}] [${req.__authContext.authorname}]`
    );
    req.session.context = req.__authContext;
    resp.redirect(redirectTo || req.baseUrl);
  };
}

/**
 * Destroy user session and redirect to index page
 */
function authDestroySession(req, resp) {
  // resp.clearCookie(SESSION_COOKIE_NAME);
  // resp.redirect('/login');
  const { role, username } = req.session.context;
  req.session.destroy(() => {
    console.log(`Session for [${role}] [${username}] terminated`);

    resp.clearCookie(sessionConfig.cookieName);
    resp.redirect('/');
  });
}

/**
 * Creates middleware which restricts access to a resource,
 * allowing access only for specified ROLES
 * @param {ROLES[]} availableForRoles
 */
function restrictedResource(availableForRoles = []) {
  return (req, resp, next) => {
    const { role = 'unauthorised' } = req.session?.context || {};
    if (availableForRoles.includes(req.session?.context?.role)) {
      return next();
    }

    // if no session - redirect back to home
    console.log(`Resource is unavailable for [${role}]!`);
    resp.redirect(`${req.baseUrl}/login`);
  };
}

module.exports = {
  // authContextParser,
  authMakeSessionAndRedirect,
  authDestroySession,
  restrictedResource,
  ROLES,
};
