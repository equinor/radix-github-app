import merge from 'lodash/merge';

const pipelineTypes = {
  BUILD: 'build',
};

const apiEndpoints = {
  triggerPipeline(args) {
    return `/v1/applications/${args.application}/pipelines/${args.pipeline}`;
  },
};

function getEndpoint(route, args) {
  const escapedArgs = {};

  Object.keys(args).forEach(argName => {
    escapedArgs[argName] = encodeURIComponent(args[argName]);
  });

  return route(escapedArgs);
}

export default class RadixApiClient {
  constructor(token) {
    this._token = token;
  }

  async triggerBuildPipeline({ application, commitId }) {
    const body = JSON.stringify({
      branch: pipelineTypes.BUILD,
      commitID: commitId,
    });

    const endpoint = getEndpoint(apiEndpoints.triggerPipeline, {
      application,
      pipeline,
    });

    return this._fetch(endpoint, {
      body,
    });
  }

  _fetch(resource, init) {
    const authOptions = merge(
      { headers: { Authorization: `Bearer ${this.token}` } },
      init
    );

    return fetch(resource, authOptions);
  }
}
