const postService = require('../services/post_service');

function addPageContext(req, resp, next) {
  const isLoggedIn = !!req.session?.context?.role;
  req.__pageContext = {
    isLoggedIn,
    role: req.session?.context?.role,
  };

  const userMark = isLoggedIn
    ? `${req.__pageContext.role} ${req.session.context.authorname}`
    : 'unauthorized';
  console.log(`page access from [${userMark}]`);

  next();
}

function renderPage(templateName) {
  return (req, resp) => {
    resp.render(templateName, req.__pageContext);
  };
}

async function fetchAllPosts(req, _resp, next) {
  const postList = await postService.getAllPosts();
  const modifiedPosts = [...postList];

  req.__pageContext.postList = modifiedPosts
    .map((post) => {
      const date = new Date(`${post.date_creation}`);
      post.date_creation = date.toUTCString();
      return post;
    })
    .sort(function (a, b) {
      return new Date(b.date_creation) - new Date(a.date_creation);
    });

  next();
}

async function fetchMyPosts(req, _resp, next) {
  const postList = await postService.getMyPosts(req.session.context.author_id);

  req.__pageContext.postList = postList;

  next();
}

async function addNewPost(req, resp, next) {
  try {
    await postService.addNewPost({
      ...req.body,
      author_id: req.session.context.author_id,
    });
    resp.redirect(req.baseUrl || '/my-posts');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addPageContext,
  renderPage,
  fetchAllPosts,
  fetchMyPosts,
  addNewPost,
};
