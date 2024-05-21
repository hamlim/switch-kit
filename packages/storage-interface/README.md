# `@switch-kit/storage-interface`

The type contracts (as TypeScript types/interfaces) for the Switch Kit ecosystem. Useful if you're implementing a custom Storage Adaptor.

> Note: If you're only looking to use Switch Kit with a pre-built adaptor, you don't need to install this package directly. Instead, install the `switch-kit` package and the adaptor you want to use.

## Getting Started:

```sh
bun add @switch-kit/storage-interface
```

## Usage:

```tsx
import type {
  StorageAdaptor,
  Switch,
  SwitchMetadata,
} from "@switch-kit/storage-interface";

// Implement the StorageAdaptor interface
export class MyAdaptor implements StorageAdaptor {
  constructor() {
    // Initialize your adaptor here
  }

  async init() {
    // Async initialization code
  }

  async get(key: string): Promise<Switch | undefined> {
    // Get a Switch by key
  }

  async set({
    key,
    value,
    metadata = {},
  }: {
    key: string;
    value: string;
    metadata?: SwitchMetadata;
  }): Promise<void> {
    // Set a Switch by key
  }
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
