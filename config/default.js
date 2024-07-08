const isProd = process.env.NODE_ENV === 'production';
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  server: {
    defaultPort: Number(process.env.DEFAULT_PORT) || 3333,
  },
  db: {
    defaultDb: process.env.DATABASE_URL,
  },
  session: {
    // secureCookie: false, // httpS || http
    cookieName: 'sid',
    secret: process.env.SESSION_SECRET,
  },
};
