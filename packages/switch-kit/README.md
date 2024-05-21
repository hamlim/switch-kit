# `switch-kit`

A "build-your-own" Feature Flagging/Toggling/Experimentation/etc system!

## Getting Started:

```sh
bun add switch-kit
```

You'll most likely also want to install one of the existing storage adapters, such as `@switch-kit/cloudflare-kv-adaptor`:

```sh
bun add @switch-kit/cloudflare-kv-adaptor
```

## Usage:

```tsx
// Create the SwitchKit client
let switchKit = new SwitchKit({
  // This example is using the CloudflareKVAdaptor
  // However you can change this out for anything that implements the StorageAdaptor interface from `@switch-kit/storage-interface`
  adaptor: new CloudflareKVAdaptor({
    namespace: "my-switches",
    authToken: process.env.CLOUDFLARE_AUTH_TOKEN,
    accountID: process.env.CLOUDFLARE_ACCOUNT_ID,
  }),
});

// Initialize the SwitchKit client
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

### Publishing:

To publish the library, run `bun run pub` from the workspace root. This will prompt you to login to npm and publish the package.

> Note: In the future, we will automate this process using GitHub Actions. And also add in tooling to manage releases / changelogs!
