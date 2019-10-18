import { getOctokit } from '../../octokit.js';
import RadixApiClient from '../../radix-api';

export default async function handlePullRequestOpened(payload) {
  console.log('we should start a build right about here');
  let result;

  try {
    const octokit = getOctokit(payload.installation.id);
    result = await octokit.repos.createStatus({
      context: 'radix',
      description: 'Sample description',
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      sha: payload.pull_request.head.sha,
      state: 'pending',
      target_url: 'http://example.com',
    });
  } catch (e) {
    console.error('error', e);
  }

  const api = new RadixApiClient('someToken'); // TODO: inject this  // TODO: get someToken

  api.triggerBuildPipeline({
    application: payload.repository.name, // TODO: not correct; need to read from API first
    commitId: payload.pull_request.head.sha,
  });

  return result;
}
