require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { authenticate } = require('./src/auth');
const { startScheduler } = require('./src/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up the Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set up authentication routes
authenticate(app, oauth2Client);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start the scheduler after the server starts and OAuth2 has been set up
  startScheduler(oauth2Client);
});

module.exports = oauth2Client;
