const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  server: {
    defaultPort: Number(process.env.DEFAULT_PORT) || 3000,
  },
};
