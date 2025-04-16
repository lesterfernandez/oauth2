# oauth2

oauth2 are lightweight and simple libraries with the goal of quickly integrating OAuth 2.0 using any provider with type-safety and security in mind by following the OAuth 2.0 protocol and extensions such as the PKCE flow.

These libraries are meant to be utilized together in projects that have server-side processing in order to securely exchange access tokens.

## Features

* [PKCE](https://oauth.net/2/pkce/) flow
    * Additional layer of security that protects users against CSRF and authorization code injection attacks.
* Simple to add
    *  See [usage](#usage) examples
* Type-safety

## Prerequisites

npm (Node Package Manager)

```
npm install npm@latest -g
```

## Installation

Currently there is only support for React SPA applications in the frontend and express in the backend. Support for SSR frameworks will be added in the future.

### In frontend project
```
npm install @oauth2/react-spa
```

### In backend project
```
npm install @oauth2/express
```

## Usage

### Using `@oauth2/express` 

1. Create express server and setup provider

```js
import express, { json } from "express";
import { OAuth } from "@oauth2/express";

// Setup provider
const oauth = new OAuth();
oauth.setupProvider("google", {
  tokenUrl: GOOGLE_TOKEN_URL,
  clientSecret: GOOGLE_CLIENT_SECRET,
  clientId: GOOGLE_CLIENT_ID,
  onSuccess: ({ res, data }) => {
    res.json(data);
  },
  onFailure: ({ res, error }) => {
    res.status(401).json({ error: error.message });
  },
});

// Add route endpoint with OAuth middleware
const app = express();
app.use(json());

app.use("/oauth", oauth.authenticate());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

### Using `@oauth2/react-spa` and [Vite React](https://vite.dev/guide/)

2. Wrap application around `OAuthSpaProvider` and provide `callbackUrl` from backend server and `onSuccess` callback 

```js
import { OAuthSpaProvider } from "@oauth2/react-spa";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OAuthSpaProvider
      callbackUrl={`${env.VITE_SERVER_URL}/oauth`}
      onSuccess={async ({ provider, response }) => {
        const data = (await response.json()) as { name: string };
        console.log(`Logged in using ${provider}! Hello ${data.name}`);
      }}
      onError={async ({ provider, reason }) => {
        console.error(`Error authenticating with ${provider}: ${reason}`);
      }
    >
      <App />
    </OAuthSpaProvider>
  </StrictMode>,
)
```

3. Add `redirectToProvider`

```js
import { useOAuth } from "@oauth2/react-spa";

export const App = () => {
  const { redirectToProvider, loading } = useOAuth();

  const onSignIn = () => {
    redirectToProvider({
      clientId: env.VITE_GOOGLE_CLIENT_ID,
      provider: "google", // or add custom provider link
      scope: "email profile" // default
    });
  }

  return (
    <div>
      <button onClick={onSignIn} disabled={loading}>
        {loading ? "Loading..." : "Sign in with Google"}
      </button>
    </div>
  );
}
```

A full example handling user data can be found in the [examples](https://github.com/lesterfernandez/oauth2/tree/master/examples) directory. 

## How it works

1. User clicks sign in button, is redirected to OAuth provider.
2. `OAuthSpaProvider` detects successful OAuth redirect, passes token information to backend.
3. Backend server requests access token and passes information to `onSuccess` or `onFailure` callbacks.
4. Frontend server receives information related to OAuth sign-in in `onSuccess`, `onError`, and `onRedirect` callbacks.
