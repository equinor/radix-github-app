import { getOctokit } from '../../octokit.js';

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
  return result;
}
