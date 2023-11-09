const {
  fetchUnreadEmails,
  filterUnrepliedEmails,
  sendReply,
  applyLabelAndArchive
} = require('./mailProcessor');

function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function startScheduler(oauth2Client) {
  async function processEmails() {
    try {
      console.log('Checking for new emails...');

      // Fetch all unread emails
      const unreadEmails = await fetchUnreadEmails(oauth2Client);
      if (unreadEmails.length > 0) {
        // Filter for unreplied emails
        const unrepliedEmails = await filterUnrepliedEmails(oauth2Client, unreadEmails);

        // Loop over each unreplied email and perform necessary actions
        for (const email of unrepliedEmails) {
          // Reply to the email
          await sendReply(oauth2Client, email);
          // Apply label and archive the email
          await applyLabelAndArchive(oauth2Client, email);
          console.log(`Processed and replied to email with ID: ${email.id}`);
        }
      } else {
        console.log('No new unread emails to process.');
      }
    } catch (error) {
      console.error('Error during email processing:', error);
    } finally {
      // Schedule the next run
      const nextRunIn = getRandomInterval(45, 120) * 1000; // Random time between 45 to 120 seconds
      console.log(`Next check in ${nextRunIn / 1000} seconds.`);
      setTimeout(processEmails, nextRunIn);
    }
  }

  processEmails();
}

module.exports = { startScheduler };
