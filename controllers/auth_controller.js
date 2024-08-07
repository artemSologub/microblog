const bcrypt = require('bcrypt');

const { AuthError } = require('../errors');
const { ROLES } = require('../middleware/auth_context');
const authorService = require('../services/author_service');

async function logAuthorIn(req, resp, next) {
  const { authorname, password } = req.body;
  const author = await authorService.findByAuthorName(authorname);
  if (!author) {
    return next(
      new AuthError({
        msg: `author [${authorname}] - invalid creds`,
        errors: { auth: 'Invalid creds!' },
      })
    );
  }

  const isPasswordOk = await bcrypt.compare(password, author.password_hash);
  if (!isPasswordOk) {
    return next(
      new AuthError({
        msg: `author [${authorname}] - invalid creds`,
        errors: { auth: 'Invalid creds!' },
      })
    );
  }

  //! 3. if we are here - creds are OK
  const role = author.role || ROLES.user;
  // req.__authContext.isLoggedIn = true;
  req.__authContext = { authorname, role, author_id: author.id };
  console.log(`author [${authorname}] - successfully logged in`);

  next();
}

async function createAuthorAccount(req, resp, next) {
  const { authorname, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  try {
    const role = ROLES.user;
    const newAuthor = await authorService.saveNewAuthor({
      authorname,
      hashedPass,
      role,
    });
    const author = await authorService.findByAuthorName(authorname);
    req.__authContext = { authorname, role, author_id: author.id };
    console.log(
      `author [${newAuthor.authorname}] - successfully created new account`
    );

    next();
  } catch (err) {
    console.log('err', err);
    next(err);
  }
}

module.exports = {
  logAuthorIn,
  createAuthorAccount,
};
