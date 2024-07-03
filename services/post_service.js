const { PrismaClient } = require('@prisma/client');
const {
  PrismaClientKnownRequestError,
} = require('@prisma/client/runtime/library');

const prisma = new PrismaClient();

const { NotFoundError } = require('../errors');

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

async function deletePostById(videoId) {
  try {
    return await prisma.post.delete({ where: { id: postId } });
  } catch (err) {
    // transforming Prisma-specific error "no item to delete" into something more generic
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new NotFoundError({ msg: 'Video not found' });
    }
    throw err;
  }
}

module.exports = {
  getAllPosts,
  getMyPosts,
  addNewPost,
  deletePostById,
};
