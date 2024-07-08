const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function getAllPosts() {
  return prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });
}

function getMyPosts(author_id) {
  return prisma.post.findMany({
    where: { author_id },
    include: {
      author: true,
    },
  });
}

function addNewPost(metadata) {
  return prisma.post.create({ data: metadata });
}

function deletePost(postId) {
  return prisma.$transaction(async (prisma) => {
    await prisma.comment.deleteMany({
      where: { post_id: postId },
    });

    await prisma.post.delete({
      where: { id: postId },
    });
  });
}

function addNewComment(metadata) {
  return prisma.comment.create({ data: metadata });
}

module.exports = {
  getAllPosts,
  getMyPosts,
  addNewPost,
  deletePost,
  addNewComment,
};
