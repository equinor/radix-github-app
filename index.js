import dotenv from 'dotenv';
import OctokitWebhooksApi from '@octokit/webhooks';
import EventSource from 'eventsource';
import http from 'http';

import { initGithubApp } from './octokit.js';
import { getName, getVersion } from './app-info.js';
import handlers from './handlers/index.js';

dotenv.config();

initGithubApp({
  id: process.env.GITHUB_APP_IDENTIFIER,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
});

// ----------------------------------------------------------------------------

const port = process.env.PORT || 3000;
const webhooks = new OctokitWebhooksApi({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
});

const webhookProxyUrl = `https://smee.io/${process.env.SMEE_ID}`;
const source = new EventSource(webhookProxyUrl);

source.onmessage = event => {
  const webhookEvent = JSON.parse(event.data);
  webhooks
    .verifyAndReceive({
      id: webhookEvent['x-request-id'],
      name: webhookEvent['x-github-event'],
      signature: webhookEvent['x-hub-signature'],
      payload: webhookEvent.body,
    })
    .catch(console.error);
};

webhooks.on('*', ({ id, name, payload }) => {
  console.log(id, name, 'event received', payload);
  const action = payload.action;
  const handler = handlers[name];

  if (!handler) {
    console.warn(`No handler for hook "${name}" found`);
    return;
  }

  const actionHandler = handler[action];

  if (!actionHandler) {
    console.warn(`No handler for action "${action}" in hook "${name}" found`);
    return;
  }

  actionHandler(payload);
});

// ----------------------------------------------------------------------------

const app = http.createServer(webhooks.middleware);

app.listen(port, () =>
  console.log(`${getName()} v${getVersion()} listening on port ${port}`)
);
