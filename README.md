# oauth2

oauth2 is a suite of lightweight and simple libraries with the goal of quickly integrating OAuth 2.0 into web applications.

## Features

- Easy integration with React and Express
- Compatible with multiple OAuth 2.0 providers
- Simple to add (see [usage](#usage) examples)
- Type-safety

## Basic Usage

### `@oauth2/express`

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

### `@oauth2/react-spa` with [Vite React](https://vite.dev/guide/)

1. Wrap application around `OAuthSpaProvider` and provide `callbackUrl` from backend server and `onSuccess` callback

```tsx
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

2. Commence the authorization flow

```tsx
import { useOAuth } from "@oauth2/react-spa";

export const App = () => {
  const { redirectToProvider, loading } = useOAuth();

  const onSignIn = () => {
    redirectToProvider({
      clientId: env.VITE_GOOGLE_CLIENT_ID,
      provider: "google",
      scope: "email profile openid",
    });
  };

  return (
    <div>
      <button onClick={onSignIn} disabled={loading}>
        {loading ? "Loading..." : "Sign in with Google"}
      </button>
    </div>
  );
};
```

A full example handling user data can be found in the [examples](https://github.com/lesterfernandez/oauth2/tree/master/examples) directory.

## How it works

1. User clicks sign in button and is redirected to OAuth provider
2. User signs into their provider and is redirected back to the client
3. `OAuthSpaProvider` detects the OAuth redirect before forwarding an authorization token along with some other data to the backend
4. Backend server requests access token and passes data to the `onSuccess` or `onFailure` callback
5. Backend sends response data to the client
6. Client receives a backend response and makes it available through the `onSuccess` or `onFailure` callback
