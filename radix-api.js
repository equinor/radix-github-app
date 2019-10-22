import merge from 'lodash/merge.js';
import fetch from 'node-fetch';

export const RADIX_DOMAIN = 'dev.radix.equinor.com'; // TODO: This shouldn't be here; derive from cluster
const RADIX_API_DOMAIN = `api.${RADIX_DOMAIN}`;
const RADIX_APP_CACHE_LIFETIME = 60000;

const pipelineTypes = {
  BUILD: 'build',
};

const apiEndpoints = {
  getMatchingApplications(args) {
    return `/api/v1/applications?sshRepo=${args.repoUrl}`;
  },
  triggerPipeline(args) {
    return `/api/v1/applications/${args.application}/pipelines/${args.pipeline}`;
  },
};

function getEndpoint(route, args = {}) {
  const escapedArgs = {};

  Object.keys(args).forEach(argName => {
    escapedArgs[argName] = encodeURIComponent(args[argName]);
  });

  return `https://${RADIX_API_DOMAIN}${route(escapedArgs)}`;
}

export default class RadixApiClient {
  constructor(token) {
    this._token = token;
    this._appCache = [];
    this._appCacheTimestamp = 0;
  }

  async triggerBuildPipeline({ application, commitId }) {
    const body = JSON.stringify({
      branch: 'master', // TODO: this doesn't make sense
      commitID: commitId,
    });

    const endpoint = getEndpoint(apiEndpoints.triggerPipeline, {
      application,
      pipeline: pipelineTypes.BUILD,
    });

    return this._fetchJson(endpoint, {
      method: 'post',
      body,
    });
  }

  async getMatchingApplications(repoUrl) {
    if (Date.now() < this._appCacheTimestamp + RADIX_APP_CACHE_LIFETIME) {
      return this._appCache;
    }

    this._appCache = await this._fetchJson(
      getEndpoint(apiEndpoints.getMatchingApplications, {
        repoUrl,
      })
    );
    return this._appCache;
  }

  async _fetch(resource, init) {
    const authOptions = merge(
      { headers: { Authorization: `Bearer ${this._token}` } },
      init
    );

    return fetch(resource, authOptions);
  }

  async _fetchJson(resource, init) {
    const response = await this._fetch(resource, init);
    let json;
    try {
      json = await response.json();
    } catch (e) {
      console.warn('Cannot parse JSON', response.status, response.statusText); // TODO: use scoped exceptions
      return [];
    }
    return json;
  }
}
