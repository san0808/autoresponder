const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Redirect to authentication URL
app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/gmail.modify',
  });
  res.redirect(url);
});

// Handle authentication callback and exchange code for tokens
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);


  console.log(tokens);
  // Save the tokens 

  res.send('Authentication successful! Close this page and return to the app.');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
