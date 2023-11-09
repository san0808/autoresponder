const { google } = require('googleapis');

function isLikelyAdvertisement(senderEmail) {
  // Define a list of domains or keywords often used by advertisement or newsletter services
  const keywords = ['newsletter', 'no-reply', 'offers', 'marketing', 'promo', 'deals' ,'support'];
  const domains = ['offers.example.com', 'newsletters.example.com']; // we can add known domains here
  return keywords.some(keyword => senderEmail.includes(keyword)) ||
         domains.some(domain => senderEmail.endsWith(domain));
}

function hasUnsubscribeLink(emailBody) {
  return emailBody.toLowerCase().includes('unsubscribe');
}

function isPromotionalSubject(subjectLine) {
  const promoKeywords = ['sale', 'promotion', 'exclusive', 'limited time', 'offer'];
  return promoKeywords.some(keyword => subjectLine.toLowerCase().includes(keyword));
}

function isBulkEmail(headers) {
  return headers.some(header => header.name.toLowerCase() === 'list-id');
}

async function fetchUnreadEmails(oauth2Client) {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      q: 'is:unread (category:updates)'
    });
    return response.data.messages || []; // If there are no messages, return an empty array
  } catch (error) {
    console.error('The API returned an error:', error);
    throw error;
  }
}

async function filterUnrepliedEmails(oauth2Client, unreadEmails) {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const filteredEmails = [];

  for (const message of unreadEmails) {
    const messageDetails = await gmail.users.messages.get({
      userId: 'me',
      id: message.id
    });

    const senderEmail = messageDetails.data.payload.headers
      .find(header => header.name === 'From').value;
    const subjectLine = messageDetails.data.payload.headers
      .find(header => header.name === 'Subject').value;
    const emailBody = messageDetails.data.snippet; // or use body if you fetch the full message body

    // Check if the email should not be replied to
    if (isLikelyAdvertisement(senderEmail) ||
        hasUnsubscribeLink(emailBody) ||
        isPromotionalSubject(subjectLine) ||
        isBulkEmail(messageDetails.data.payload.headers)) {
      continue; // Skip this email
    }

    // Proceed with other checks as necessary and add to filtered emails if it passes all
    filteredEmails.push(message);
  }

  return filteredEmails;
}


async function sendReply(oauth2Client, email) {
  try{
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      // Use the email ID to fetch the email thread
      const thread = await gmail.users.threads.get({
        userId: 'me',
        id: email.threadId,
      });

      // Create the reply message
      const message = "I am currently out of office and will get back to you as soon as I return.";
      const encodedMessage = Buffer.from(`Content-Type: text/plain; charset="UTF-8"\nMIME-Version: 1.0\nContent-Transfer-Encoding: 7bit\nto: ${thread.data.messages[0].payload.headers.find(header => header.name === "From").value}\nsubject: Re: ${thread.data.messages[0].payload.headers.find(header => header.name === "Subject").value}\n\n${message}`).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      // Send the reply
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
          threadId: email.threadId
        }
      });

  } catch (error) {
    console.error(`Failed to send reply to ${email.id}:`, error);
  }
  
}

async function applyLabelAndArchive(oauth2Client, email) {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Create a label or use an existing one
  let labelId = '';
  const labelName = 'Auto-Responder';
  const labels = await gmail.users.labels.list({ userId: 'me' });
  const existingLabel = labels.data.labels.find(label => label.name === labelName);

  if (existingLabel) {
    labelId = existingLabel.id;
  } else {
    const newLabel = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
      }
    });
    labelId = newLabel.data.id;
  }

  // Apply the label to the email
  await gmail.users.messages.modify({
    userId: 'me',
    id: email.id,
    requestBody: {
      addLabelIds: [labelId],
      removeLabelIds: ['INBOX'] // Removing from INBOX to archive
    }
  });
}

module.exports = {
  fetchUnreadEmails,
  filterUnrepliedEmails,
  sendReply,
  applyLabelAndArchive
};

