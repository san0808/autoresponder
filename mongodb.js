const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
  }
}

async function getTokens(userId) {
  const database = client.db('yourDatabaseName');
  const tokensCollection = database.collection('tokens');
  const tokensDocument = await tokensCollection.findOne({ userId: userId });
  return tokensDocument ? tokensDocument.tokens : null;
}

async function saveTokens(userId, tokens) {
  const database = client.db('yourDatabaseName');
  const tokensCollection = database.collection('tokens');
  const updateResult = await tokensCollection.updateOne(
    { userId: userId },
    { $set: { tokens } },
    { upsert: true }
  );
  console.log(`Tokens saved for user ${userId}`);
}

module.exports = { connect, getTokens, saveTokens };
