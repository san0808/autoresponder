const { startScheduler } = require('./scheduler');

function authenticate(app, oauth2Client) {
    app.get('/auth', (req, res) => {
      // Generate an authentication URL
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.modify']
      });
      res.redirect(url);
    });
  
    app.get('/auth/callback', async (req, res) => {
      const { code } = req.query;
      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
    
        // Save the tokens for later use
        // ... (code to save tokens securely)
    
        startScheduler(oauth2Client);
    
        res.send('Authentication successful! The auto-reply scheduler has started.');
      } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Authentication failed');
      }
    });
  }
  
  module.exports = { authenticate };
  