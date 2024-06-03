### Unreleased:

### [0.1.2] - June 3rd, 2024

- Fix `CloudflareKVAdaptor.set`/`CloudflareKV.writeKeyWithMetadata` not properly encoding the request body
  - Previously, we sent the request body as stringified JSON but Cloudflare expects form data. This has been fixed and the request body is now properly encoded as form data.

### [0.1.1] - May 23rd, 2024

- Fix `init` not working when the namespace already exists
  - With this change, you can now call init multiple times on the same client with the same namespace and it will connect to the existing namespace!

### [0.1.0] - May 21st, 2024

- Initial working release

### [0.0.1] - May 21st, 2024

- Initial release
