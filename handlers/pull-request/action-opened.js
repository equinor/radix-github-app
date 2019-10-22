import { getOctokit } from '../../octokit.js';
import RadixApiClient, { RADIX_DOMAIN } from '../../radix-api.js';

async function createPRStatus(octokit, payload, radixJob) {
  let result;
  console.log('Creating status in GitHub');
  try {
    result = await octokit.repos.createStatus({
      context: 'radix',
      description: 'Sample description',
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      sha: payload.pull_request.head.sha,
      state: 'pending',
      target_url: `https://console.${RADIX_DOMAIN}/applications/${radixJob.appName}/jobs/view/${radixJob.name}`, // TODO: build this properly
    });
  } catch (e) {
    console.error('Could not create PR status on GitHub', e);
  }

  return result;
}

export default async function handlePullRequestOpened(payload) {
  console.log('we should start a build right about here');

  const api = new RadixApiClient(process.env.RADIX_API_TOKEN);
  const octokit = getOctokit(payload.installation.id);
  const apps = await api.getMatchingApplications(payload.repository.ssh_url);

  for (let i = 0; i < apps.length; i++) {
    // TODO: Handle failures
    const app = apps[i];
    const radixJob = await api.triggerBuildPipeline({
      application: app.name,
      commitId: payload.pull_request.head.sha,
    });

    console.log('Created Radix job', radixJob);
    createPRStatus(octokit, payload, radixJob);
  }
}
