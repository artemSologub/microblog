const { PrismaClient } = require('@prisma/client');
const {
  PrismaClientKnownRequestError,
} = require('@prisma/client/runtime/library');
const { AuthError } = require('../errors');

const prisma = new PrismaClient();

async function saveNewAuthor({ authorname, hashedPass }) {
  try {
    return await prisma.author.create({
      data: {
        authorname,
        password_hash: hashedPass,
      },
    });
  } catch (err) {
    // transforming Prisma-specific error "unique key violation" into something more generic
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AuthError({ msg: 'Cannot use this authorname' });
    }

    throw err;
  }
}

function findByAuthorName(authorname) {
  console.log('authorname', authorname);
  return prisma.author.findFirst({ where: { authorname } });
}

module.exports = {
  saveNewAuthor,
  findByAuthorName,
};
