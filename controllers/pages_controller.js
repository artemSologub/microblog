const postService = require('../services/post_service');

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
  const postList = await postService.getMyPosts();

  req.__pageContext.postList = postList;

  next();
}

async function addNewPost(req, _resp, next) {
  try {
    await postService.addNewPost({
      ...req.body,
    });
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  renderPage,
  fetchAllPosts,
  fetchMyPosts,
  addNewPost,
};
