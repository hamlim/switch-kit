# `@switch-kit/cloudflare-kv-adaptor`

A Cloudflare KV Adaptor for `switch-kit`!

> Note: This package also exports a `CloudflareKV` class that can be used to interact with Cloudflare KV directly via their REST API ([docs](https://developers.cloudflare.com/api/operations/workers-kv-namespace-list-namespaces))

## Getting Started:

```sh
bun add @switch-kit/cloudflare-kv-adaptor
```

Make sure you also install `switch-kit` if you haven't already:

```sh
bun add switch-kit
```

## Usage:

```tsx
// Create the SwitchKit client
let switchKit = new SwitchKit({
  adaptor: new CloudflareKVAdaptor({
    // Essentially a "scope" for the various switches being stored within Cloudflare KV
    namespace: "my-switches",
    // An Auth Token for your KV instance
    authToken: process.env.CLOUDFLARE_AUTH_TOKEN,
    // A Cloudflare Account ID
    accountID: process.env.CLOUDFLARE_ACCOUNT_ID,

    // Optional:
    // If you use a different cloudflare API URL, or a custom Cloudflare-like API, you can specify it here
    baseAPIURL: "https://api.cloudflare.com/client/v4",
    // If you use a different fetch implementation, you can specify it here
    // This is useful if you wrap `fetch` with additional logic, e.g. timeout middleware etc.
    fetch: globalThis.fetch,
  }),
});

// Initialize the SwitchKit client
// This will create the namespace if it doesn't exist
await switchKit.init();

// Returns either a Switch or undefined
let switchA = await switchKit.get("switch-a");

if (switchA?.value === "on") {
  // do something
}
```

## Contributing:

### Building:

This library uses [`swc`](https://swc.rs/) and [`TypeScript`](https://www.typescriptlang.org/docs/) to build the source code and generate types.

To build the library, run `bun run build` from the root, or from this workspace!

### Code Quality:

#### Type Checking:

This library uses TypeScript to perform type checks, run `bun run type-check` from the root or from this workspace!

#### Linting

This library uses [BiomeJS](https://biomejs.dev/) for linting, run `bun run lint` from the root or from this workspace!

#### Tests

This library uses Bun for running unit tests, run `bun run test` from the root or from this workspace!
