import OctokitApp from '@octokit/app';
import Octokit from '@octokit/rest';

import { getName, getVersion } from './app-info.js';

let githubApp;

export function initGithubApp(initOptions) {
  githubApp = new OctokitApp.App(initOptions);
}

export function getOctokit(installationId) {
  if (!githubApp) {
    throw 'getOctokit() invoked before initGithubApp()';
  }

  return new Octokit({
    // auth: process.env.GITHUB_WEBHOOK_SECRET,
    async auth() {
      const installationAccessToken = await githubApp.getInstallationAccessToken(
        {
          installationId,
        }
      );
      return `token ${installationAccessToken}`;
    },
    userAgent: `${getName()} v${getVersion()}`,
  });
}
