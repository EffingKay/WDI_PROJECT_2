const databaseUrl = process.env.MONGODB_URI || 'mongodb://localhost/wdi-project-2';
const secret = 'Something top secret...';

module.exports = {
  databaseUrl,
  secret
};
