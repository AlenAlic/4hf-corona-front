# API Module

The API module abstracts interaction with API's.
It removes the complexities of networking and presents only a set of functions that return promises for API results.
Network errors and API error responses are generalized by rejected promises.

## Layout

Path | Purpose
--- | ---
`auth.js` | Abstraction for authentication and account management (activation, password reset, etc)
`backend.js` | Abstracts file fetching from the backend server that the app is hosted on.
`frontend.js` | Abstracts file fetching from the frontend server that the app is hosted on.
`notifications.js` | Abstraction for push notification support
`user.js` | Abstraction for user management
`util/` | Api logic that is not an abstraction
`util/network-errors.js` | Functions for deducing network errors and generate generic error messages for network errors.
`util/token-storage.js` | Exposes functions to save and load API tokens


