const postService = require('../services/post_service');
const { sortByCreationDate } = require('../utils/helpers');

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

  req.__pageContext.postList = sortByCreationDate(modifiedPosts);

  next();
}

async function fetchMyPosts(req, _resp, next) {
  const postList = await postService.getMyPosts(req.session.context.author_id);

  req.__pageContext.postList = sortByCreationDate(postList);

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

async function deletePost(req, resp, next) {
  const id = Number(req.params.id);
  try {
    await postService.deletePost(id);
    resp.redirect(req.baseUrl || '/my-posts');
  } catch (err) {
    next(err);
  }
}

async function addNewComment(req, resp, next) {
  try {
    await postService.addNewComment({
      ...req.body,
      post_id: Number(req.body.post_id),
      author_id: req.session.context.author_id,
    });
    resp.redirect(req.baseUrl || '/');
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
  deletePost,
  addNewComment,
};
