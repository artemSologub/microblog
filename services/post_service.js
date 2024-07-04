const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function getAllPosts() {
  return prisma.post.findMany({
    include: { author: true },
  });
}

function getMyPosts(author_id) {
  return prisma.post.findMany({
    where: { author_id },
    include: { author: true },
  });
}

function addNewPost(metadata) {
  return prisma.post.create({ data: metadata });
}

function deletePost(postId) {
  return prisma.post.delete({ where: { id: postId } });
}

module.exports = {
  getAllPosts,
  getMyPosts,
  addNewPost,
  deletePost,
};
