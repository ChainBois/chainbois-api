---
description: MCP Server for Google Slides. Contribute to matteoantoci/google-slides-mcp development by creating an account on GitHub.
image: https://opengraph.githubassets.com/b99bd6a28fcfa5d6f7ed44719b744b21caedeb1ebbc1f74a729adbf6bb9fcac4/matteoantoci/google-slides-mcp
title: GitHub - matteoantoci/google-slides-mcp: MCP Server for Google Slides
---

[Skip to content](#start-of-content)

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

{{ message }}

[ matteoantoci](/matteoantoci) / **[google-slides-mcp](/matteoantoci/google-slides-mcp)** Public

- [ Notifications](/login?return%5Fto=%2Fmatteoantoci%2Fgoogle-slides-mcp) You must be signed in to change notification settings
- [ Fork36 ](/login?return%5Fto=%2Fmatteoantoci%2Fgoogle-slides-mcp)
- [ Star 156 ](/login?return%5Fto=%2Fmatteoantoci%2Fgoogle-slides-mcp)

[](/matteoantoci/google-slides-mcp)

main

[Branches](/matteoantoci/google-slides-mcp/branches)[Tags](/matteoantoci/google-slides-mcp/tags)

Go to file

Code

Open more actions menu

## Folders and files

| Name                                                                                                 | Name                                                                                                 | Last commit message | Last commit date |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------- | ---------------- |
| Latest commit History[16 Commits](/matteoantoci/google-slides-mcp/commits/main/)16 Commits           |                                                                                                      |                     |                  |
| [src](/matteoantoci/google-slides-mcp/tree/main/src "src")                                           | [src](/matteoantoci/google-slides-mcp/tree/main/src "src")                                           |                     |                  |
| [.gitignore](/matteoantoci/google-slides-mcp/blob/main/.gitignore ".gitignore")                      | [.gitignore](/matteoantoci/google-slides-mcp/blob/main/.gitignore ".gitignore")                      |                     |                  |
| [.prettierrc](/matteoantoci/google-slides-mcp/blob/main/.prettierrc ".prettierrc")                   | [.prettierrc](/matteoantoci/google-slides-mcp/blob/main/.prettierrc ".prettierrc")                   |                     |                  |
| [LICENSE](/matteoantoci/google-slides-mcp/blob/main/LICENSE "LICENSE")                               | [LICENSE](/matteoantoci/google-slides-mcp/blob/main/LICENSE "LICENSE")                               |                     |                  |
| [README.md](/matteoantoci/google-slides-mcp/blob/main/README.md "README.md")                         | [README.md](/matteoantoci/google-slides-mcp/blob/main/README.md "README.md")                         |                     |                  |
| [eslint.config.js](/matteoantoci/google-slides-mcp/blob/main/eslint.config.js "eslint.config.js")    | [eslint.config.js](/matteoantoci/google-slides-mcp/blob/main/eslint.config.js "eslint.config.js")    |                     |                  |
| [package-lock.json](/matteoantoci/google-slides-mcp/blob/main/package-lock.json "package-lock.json") | [package-lock.json](/matteoantoci/google-slides-mcp/blob/main/package-lock.json "package-lock.json") |                     |                  |
| [package.json](/matteoantoci/google-slides-mcp/blob/main/package.json "package.json")                | [package.json](/matteoantoci/google-slides-mcp/blob/main/package.json "package.json")                |                     |                  |
| [tsconfig.json](/matteoantoci/google-slides-mcp/blob/main/tsconfig.json "tsconfig.json")             | [tsconfig.json](/matteoantoci/google-slides-mcp/blob/main/tsconfig.json "tsconfig.json")             |                     |                  |
| View all files                                                                                       |                                                                                                      |                     |                  |

## Repository files navigation

# Google Slides MCP Server

This project provides a Model Context Protocol (MCP) server for interacting with the Google Slides API. It allows you to create, read, and modify Google Slides presentations programmatically.

## Prerequisites

- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)
- Google Cloud Project with the Google Slides API enabled.
- OAuth 2.0 Credentials (Client ID and Client Secret) for your Google Cloud Project.
- A Google Refresh Token associated with the OAuth 2.0 credentials and the necessary Google Slides API scopes.

## Setup

1. **Clone the repository (if applicable) or ensure you are in the project directory.**
2. **Install dependencies:**  
   npm install
3. **Build the Server:**Compile the TypeScript code to JavaScript:  
   npm run build  
   This will create a `build` directory containing the compiled JavaScript code.
4. **Obtain Google API Credentials:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Navigate to "APIs & Services" > "Enabled APIs & services".
   - Click "+ ENABLE APIS AND SERVICES", search for "Google Slides API", and enable it.
   - Navigate to "APIs & Services" > "Credentials".
   - Click "+ CREATE CREDENTIALS" > "OAuth client ID".
   - If prompted, configure the OAuth consent screen. For "User type", choose "External" unless you have a Google Workspace account and want to restrict it internally. Provide an app name, user support email, and developer contact information.
   - On the "Scopes" page during consent screen setup, click "ADD OR REMOVE SCOPES". Search for and add the following scopes:  
      _ `https://www.googleapis.com/auth/presentations` (To view and manage your presentations)  
      _ _(Optional: Add `https://www.googleapis.com/auth/drive.readonly` or other Drive scopes if needed for specific operations like listing files, although not strictly required for basic Slides operations)_
   - Save the consent screen configuration.
   - Go back to "Credentials", click "+ CREATE CREDENTIALS" > "OAuth client ID".
   - Select "Desktop app" as the Application type.
   - Give it a name (e.g., "Slides MCP Client").
   - Click "Create". You will see your **Client ID** and **Client Secret**. **Copy these down securely.** You can also download the JSON file containing these credentials.
5. **Obtain a Google Refresh Token:**
   - A refresh token allows the server to obtain new access tokens without requiring user interaction each time. Generating one typically involves a one-time authorization flow.
   - You can use the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) for this:  
      _ Go to the OAuth 2.0 Playground.  
      _ Click the gear icon (Settings) in the top right.  
      _ Check "Use your own OAuth credentials".  
      _ Enter the **Client ID** and **Client Secret** you obtained in the previous step.  
      _ In the "Step 1 - Select & authorize APIs" section on the left, find "Slides API v1" and select the `https://www.googleapis.com/auth/presentations` scope (and any other Drive scopes if you added them).  
      _ Click "Authorize APIs".  
      _ Sign in with the Google account you want the server to act on behalf of.  
      _ Grant the requested permissions.  
      \* You will be redirected back to the Playground. In "Step 2 - Exchange authorization code for tokens", you should see the **Refresh token** and Access token. **Copy the Refresh token securely.**  
     Alternatively, you can use the provided `get-token` script to obtain a refresh token. This script will build the project and then run a utility that guides you through the OAuth flow to get a refresh token. Ensure your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured in your environment or a `.env` file if the script requires them (you may need to check the `src/getRefreshToken.ts` file for details on how it expects credentials). To run the script:  
     npm run get-token
6. **Configure Credentials and Command in MCP Settings:**Locate your MCP settings file (e.g., `.../User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`). Find or create the entry for `"google-slides-mcp"` and configure it with the command to run the server and your credentials:  
   "google-slides-mcp": {  
    "transportType": "stdio",  
    "command": "node",  
    "args": [
    "/path/to/google-slides-mcp/build/index.js"
    ],  
    "env": {  
    "GOOGLE_CLIENT_ID": "YOUR_CLIENT_ID",  
    "GOOGLE_CLIENT_SECRET": "YOUR_CLIENT_SECRET",  
    "GOOGLE_REFRESH_TOKEN": "YOUR_REFRESH_TOKEN"  
    }  
    // ... other optional settings like description ...  
   }  
   Replace `/path/to/google-slides-mcp/build/index.js` with the actual path to the compiled server index file on your system. Replace `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, and `YOUR_REFRESH_TOKEN` with the actual values you obtained. The MCP runner will inject these values into the server's environment when it starts.

## Running the Server

Execute the compiled code:

npm run start

The server will start and listen for MCP requests on standard input/output (stdio). You should see a message like: `Google Slides MCP server running and connected via stdio.`

## Available Tools

The server exposes the following tools via the Model Context Protocol:

- **`create_presentation`**: Creates a new Google Slides presentation.
  - **Input:**  
     \* `title` (string, required): The title for the new presentation.
  - **Output:** JSON object representing the created presentation details.
- **`get_presentation`**: Retrieves details about an existing presentation.
  - **Input:**  
     _ `presentationId` (string, required): The ID of the presentation to retrieve.  
     _ `fields` (string, optional): A field mask (e.g., "slides,pageSize") to limit the returned data.
  - **Output:** JSON object representing the presentation details.
- **`batch_update_presentation`**: Applies a series of updates to a presentation. This is the primary method for modifying slides (adding text, shapes, images, creating slides, etc.).
  - **Input:**  
     _ `presentationId` (string, required): The ID of the presentation to update.  
     _ `requests` (array, required): An array of request objects defining the updates. Refer to the [Google Slides API batchUpdate documentation](https://developers.google.com/slides/api/reference/rest/v1/presentations/batchUpdate#requestbody) for the structure of individual requests.  
     \* `writeControl` (object, optional): Controls write request execution (e.g., using revision IDs).
  - **Output:** JSON object representing the result of the batch update.
- **`get_page`**: Retrieves details about a specific page (slide) within a presentation.
  - **Input:**  
     _ `presentationId` (string, required): The ID of the presentation containing the page.  
     _ `pageObjectId` (string, required): The object ID of the page (slide) to retrieve.
  - **Output:** JSON object representing the page details.
- **`summarize_presentation`**: Extracts and formats all text content from a presentation for easier summarization.
  - **Input:**  
     _ `presentationId` (string, required): The ID of the presentation to summarize.  
     _ `include_notes` (boolean, optional): Whether to include speaker notes in the summary. Defaults to false.
  - **Output:** JSON object containing:  
     _ `title`: The presentation's title  
     _ `slideCount`: Total number of slides  
     _ `lastModified`: Revision information  
     _ `slides`: Array of slide objects containing:  
     _ `slideNumber`: Position in presentation  
     _ `slideId`: Object ID of the slide  
     _ `content`: All text extracted from the slide  
     _ `notes`: Speaker notes (if requested and available)

_(More tools can be added by extending `src/index.ts`)_

## About

MCP Server for Google Slides

### Resources

[ Readme](#readme-ov-file)

### License

[ View license](#License-1-ov-file)

### Uh oh!

There was an error while loading. Please reload this page.

[ Activity](/matteoantoci/google-slides-mcp/activity)

### Stars

[ **156** stars](/matteoantoci/google-slides-mcp/stargazers)

### Watchers

[ **3** watching](/matteoantoci/google-slides-mcp/watchers)

### Forks

[ **36** forks](/matteoantoci/google-slides-mcp/forks)

[ Report repository](/contact/report-content?content%5Furl=https%3A%2F%2Fgithub.com%2Fmatteoantoci%2Fgoogle-slides-mcp&report=matteoantoci+%28user%29)

## [Releases](/matteoantoci/google-slides-mcp/releases)

No releases published

## [Packages0](/users/matteoantoci/packages?repo%5Fname=google-slides-mcp)

### Uh oh!

There was an error while loading. Please reload this page.

### Uh oh!

There was an error while loading. Please reload this page.

## [Contributors5](/matteoantoci/google-slides-mcp/graphs/contributors)

- [ ](https://github.com/mantoci984)
- [ ](https://github.com/matteoantoci)
- [ ](https://github.com/markmcd)
- [ ](https://github.com/MehmetKaplan)
- [ ](https://github.com/omerinvia)

## Languages

- [ TypeScript 73.4% ](/matteoantoci/google-slides-mcp/search?l=typescript)
- [ JavaScript 26.6% ](/matteoantoci/google-slides-mcp/search?l=javascript)

You can’t perform that action at this time.
