# directus-extension-sso-allow-raw-scopes

This extension allows to pass raw scopes to SSO providers.
More specifically, it passes scopes to SSO provider without being URL encoded.
This is useful, for example, when you need a scope like `api://7d2bacc2-5544-4f9b-95f7-c2a939c37bad`
