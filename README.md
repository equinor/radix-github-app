# Radix GitHub App

Work in progress.

The current code only works locally, but should be trivial to run in a proper domain. Check these links to set things and understand what's going on:

- https://developer.github.com/apps/quickstart-guides/setting-up-your-development-environment/
- https://developer.github.com/apps/quickstart-guides/using-the-github-api-in-your-app/

The app currently creates [GitHub Statuses](https://developer.github.com/v3/repos/statuses/) on PR commits.

Check the code: this app is a server; the entrypoint is `index.js`.

To run this you need to:

- Run `npm install` (once, or when deps change)
- Set up a new GitHub app (on your GitHub account for now)
- Populate the `.env` file (use a personal token to test)
- Run the Smee local proxy (see "[setting up your dev env](https://developer.github.com/apps/quickstart-guides/setting-up-your-development-environment/)")
- Run the server (`npm start`)
- Point the app at the running server (i.e. this app)
- Create a repo (in your GitHub account) for a simple Radix app
- Set up the Radix app in the dev cluster (currently hardcoded)
- Install the GitHub app in that repo

Note that you need to update the personal token in `.env` about once an hour. If you're on Mac, use this to acquire a token and copy it to the clipboard:

```bash
az account get-access-token | jq -r .accessToken | pbcopy
```
