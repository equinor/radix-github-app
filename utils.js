import JWT from 'jsonwebtoken';
import Octokit from '@octokit/rest';

export function get_payload_request(request) {
  JSON.parse(request)
}


octokit.hook.before("request", async options => {
  validate(options);
});

export function authenticate_app() {
  payload = {
    // The time that this JWT was issued, _i.e._ now.
    iat: Time.now.to_i,
  
    // JWT expiration time (10 minute maximum)
    exp: Time.now.to_i + (10 * 60),
  
    // Your GitHub App's identifier number
    iss: APP_IDENTIFIER
  }
  
  // Cryptographically sign the JWT.
  jwt = JWT.encode(payload, PRIVATE_KEY, 'RS256')
  
  // Create the Octokit client, using the JWT as the auth token.
  app_client = Octokit({
}
end

# Instantiate an Octokit client, authenticated as an installation of a
# GitHub App, to run API operations.
def authenticate_installation(payload)
@installation_id = payload['installation']['id']
@installation_token = @app_client.create_app_installation_access_token(@installation_id)[:token]
@installation_client = Octokit::Client.new(bearer_token: @installation_token)
end

# Check X-Hub-Signature to confirm that this webhook was generated by
# GitHub, and not a malicious third party.
#
# GitHub uses the WEBHOOK_SECRET, registered to the GitHub App, to
# create the hash signature sent in the `X-HUB-Signature` header of each
# webhook. This code computes the expected hash signature and compares it to
# the signature sent in the `X-HUB-Signature` header. If they don't match,
# this request is an attack, and you should reject it. GitHub uses the HMAC
# hexdigest to compute the signature. The `X-HUB-Signature` looks something
# like this: "sha1=123456".
# See https://developer.github.com/webhooks/securing/ for details.
def verify_webhook_signature
their_signature_header = request.env['HTTP_X_HUB_SIGNATURE'] || 'sha1='
method, their_digest = their_signature_header.split('=')
our_digest = OpenSSL::HMAC.hexdigest(method, WEBHOOK_SECRET, @payload_raw)
halt 401 unless their_digest == our_digest

# The X-GITHUB-EVENT header provides the name of the event.
# The action value indicates the which action triggered the event.
logger.debug "---- received event #{request.env['HTTP_X_GITHUB_EVENT']}"
logger.debug "----    action #{@payload['action']}" unless @payload['action'].nil?
end