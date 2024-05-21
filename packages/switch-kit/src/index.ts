import type { Storage, StorageAdaptor, Switch, SwitchMetadata } from "@switch-kit/storage-interface";

export type SwitchKitOptions = {
  // The storage adaptor to use
  adaptor: StorageAdaptor;
};

/**
 * SwitchKit is a simple feature flagging system that uses a StorageAdaptor to store the switches.
 *
 * Here's an example snippet of how to use SwitchKit with the @switch-kit/cloudflare-kv-adaptor package:
 *
 * ```tsx
 * let switchKit = new SwitchKit({
 *   adaptor: new CloudflareKVAdaptor({
 *     namespace: "my-switches",
 *     authToken: process.env.CLOUDFLARE_AUTH_TOKEN,
 *     accountID: process.env.CLOUDFLARE_ACCOUNT_ID,
 *   })
 * });
 *
 * await switchKit.init();
 *
 * let switchA = await switchKit.get("switch-a");
 *
 * if (switchA?.value === "on") {
 *   // do something
 * }
 * ```
 *
 * A SwitchKit client will cache the switches in memory to reduce the number of requests to Cloudflare KV.
 * To restore the cache, you can call `restoreCache` method:
 *
 * ```tsx
 * switchKit.clearCache();
 * ```
 */
export class SwitchKit implements Storage {
  adaptor: StorageAdaptor;
  cache: Map<string, Switch>;
  initialized = false;

  constructor({
    adaptor,
  }: SwitchKitOptions) {
    this.adaptor = adaptor;

    this.cache = new Map();
  }

  async init() {
    if (this.initialized) {
      return;
    }
    try {
      await this.adaptor.init();
      this.initialized = true;
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          `Failed to initialize SwitchKit client adaptor: ${err.message}`,
        );
      }
    }
  }

  /**
   * Get the value of a switch by its key.
   *
   * @note: This method will reject if the SwitchKit client hasn't been initialized yet.
   *
   * @param {string} key The key of the switch
   * @returns {Promise<string | void>} The value of the switch or undefined if the switch is not found
   */
  async get(key: string): Promise<Switch | undefined> {
    if (!this.initialized) {
      throw new Error("SwitchKit is not initialized. Call `init` method first!");
    }
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      let switchValue = await this.adaptor.get(key);
      if (switchValue) {
        this.cache.set(key, switchValue);
        return switchValue;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Unable to get switch "${key}": ${err.message}`);
      }
    }
  }

  /**
   * Set the value of a switch with some metadata
   *
   * This will also hydrate the local cache for faster reads
   *
   * @param options
   * @param {string} options.key The key of the switch
   * @param {string} options.value The value for the switch
   * @param {SwitchMetadata} [options.metadata] The optional metadata to store on the key
   */
  async set({ key, value, metadata = {} }: {
    key: string;
    value: string;
    metadata?: SwitchMetadata;
  }): Promise<void> {
    if (!this.initialized) {
      throw new Error("SwitchKit is not initialized. Call `init` method first!");
    }
    try {
      await this.adaptor.set({ key, value, metadata });
      this.cache.set(key, { value, metadata });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Unable to set switch: ${key}\n\n${err.message}`);
      }
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }
}
