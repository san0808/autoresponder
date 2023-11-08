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
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      
      // Save the tokens here (in a database or a file)
      // ...
  
      res.send('Authentication successful! Close this page and return to the app.');
    });
  }
  
  module.exports = { authenticate };
  