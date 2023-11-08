# Auto-Reply Email Application

This Node.js application automates the process of responding to emails received on a specified Gmail account, useful when the account owner is unavailable or on vacation. It checks for new emails at random intervals and sends predefined auto-reply messages to emails that haven't been replied to.

## Features

- OAuth 2.0 Authentication with Google
- Fetching unread emails from Gmail
- Sending auto-replies to new emails
- Labeling and archiving processed emails
- Configurable auto-reply message
- Randomized interval between email checks

## Technologies Used

- Node.js
- Google APIs Node.js Client
- Express.js
- dotenv
- node-fetch (if needed)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/san0808/autoresponder
   cd autoreply-email
   ```
2. Install the dependencies:
```sh
npm install
```

## Set up your .env file with the necessary credentials:
```sh
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=your-redirect-uri
```

## Start the application:
```sh
node app.js
```

## Technologies Used

- **Node.js**: The execution environment for the server-side application.
- **Google APIs Node.js Client (`googleapis`)**: The official library for interacting with Google APIs, including Gmail.
- **Express.js**: The web application framework used to set up the server and API routes.
- **dotenv**: A module to load environment variables from a `.env` file.
- **node-fetch**: A lightweight module to enable the `window.fetch` function in Node.js.

## Main Libraries

- `googleapis`:
  - **Purpose**: Interact with the Gmail API.
  - **Functions Used**:
    - `google.auth.OAuth2`: Handle OAuth2 authentication with Google.
    - `gmail.users.messages.list`: List all unread emails in the inbox.
    - `gmail.users.messages.get`: Retrieve specific email details.
    - `gmail.users.threads.get`: Check if an email thread has sent messages.
    - `gmail.users.messages.send`: Send email replies.
    - `gmail.users.labels.create`: Create a new label in Gmail.
    - `gmail.users.messages.modify`: Apply labels and archive emails.

- `express`:
  - **Purpose**: Set up the server and define API routes.

- `dotenv`:
  - **Purpose**: Manage application configuration through environment variables.

## Authentication Flow

1. Utilizes OAuth2 for user authentication with Google services.
2. Two routes (`/auth` and `/auth/callback`) manage the OAuth2 flow.
3. Tokens obtained after authentication are set for the `oauth2Client`.

## Email Processing Flow

1. A scheduler triggers the email checking process at random intervals.
2. Fetches unread emails and filters out those without any prior replies.
3. Sends replies to the filtered emails.
4. Creates (if necessary) and applies a custom label, then archives the processed emails.

## Configuration

- The `.env` file stores sensitive credentials like `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.
- Environment variables are used for configuration to separate code from configuration details.

## Security

- Credentials and tokens are not hard-coded but loaded from environment variables.
- Storage of tokens should be in a secure database or storage solution.
- Refresh tokens are used to maintain access without repeated user authentication.

## Error Handling

- API errors and exceptions are managed with try-catch blocks.
- Errors are logged to the console, suitable for monitoring and debugging.

## Improvements and Future Scope

- Implement database storage for tokens and email state management.
- Develop a front-end for monitoring and configuring auto-replies.
- Enhance error handling with a retry mechanism and better error management.
- Introduce rate limiting and quota checks to adhere to Gmail API constraints.
- Add unit and integration tests for more robust testing.
- Implement CI/CD pipelines for streamlined testing and deployment.
