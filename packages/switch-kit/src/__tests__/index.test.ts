import type { StorageAdaptor, Switch, SwitchMetadata } from "@switch-kit/storage-interface";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { SwitchKit } from "../index";

class TestStorageAdaptor implements StorageAdaptor {
  initialized: boolean = false;
  currentValue: Record<string, Switch> = {
    key: {
      value: "value",
      metadata: {
        key: "value",
      },
    },
  };
  constructor({
    initImpl,
    getImpl,
    setImpl,
  }: {
    initImpl?: () => Promise<void>;
    getImpl?: (key: string) => Promise<Switch | undefined>;
    setImpl?: ({ key, value, metadata }: { key: string; value: string; metadata?: SwitchMetadata }) => Promise<void>;
  } = {}) {
    if (initImpl) {
      this.init = initImpl;
    }
    if (getImpl) {
      this.get = getImpl;
    }
    if (setImpl) {
      this.set = setImpl;
    }
  }

  async init() {
    this.initialized = true;
  }

  async get(key: string): Promise<Switch | undefined> {
    return this.currentValue[key];
  }

  async set({ key, value, metadata = {} }: { key: string; value: string; metadata?: SwitchMetadata }) {
    this.currentValue[key] = {
      value,
      metadata,
    };
  }
}

describe("SwitchKit", () => {
  let consoleErrors: Array<string> = [];
  let originalConsoleError: typeof console.error;
  beforeEach(() => {
    consoleErrors = [];
    originalConsoleError = console.error;
    console.error = (arg) => {
      consoleErrors.push(arg);
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("it should construct a SwitchKit client", () => {
    expect(() => {
      new SwitchKit({
        adaptor: new TestStorageAdaptor(),
      });
    }).not.toThrow();
  });

  test("switchKit.init", async () => {
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor(),
    });

    await client.init();

    expect(client.initialized).toBe(true);
  });

  test("switchKit.init failure", async () => {
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor({
        initImpl: async () => {
          throw new Error("Failed to initialize TestStorageAdaptor");
        },
      }),
    });

    await client.init();

    expect(client.initialized).toBe(false);
    expect(consoleErrors.length).toBe(1);
    expect(consoleErrors[0]).toMatch(/Failed to initialize SwitchKit client/);
  });

  test("switchKit.get", async () => {
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor(),
    });

    await client.init();

    let result = await client.get("key");

    expect(result).toBeDefined();
    expect(result?.value).toBe("value");
    expect(result?.metadata).toMatchObject({ key: "value" });
  });

  test("switchKit.get cached request", async () => {
    let count = 0;
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor({
        getImpl: async () => {
          count++;
          return {
            value: "value",
            metadata: {
              key: "value",
            },
          };
        },
      }),
    });

    await client.init();

    let result = await client.get("key");
    let secondResult = await client.get("key");

    expect(result).toEqual(secondResult as Switch);
    // only call the adaptor.get method once
    expect(count).toBe(1);
  });

  test("switchKit.get not initialized", async () => {
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor(),
    });

    // intentionally missing init call!

    expect(async () => {
      await client.get("key");
    }).toThrowError(/SwitchKit is not initialized/);
  });

  test("switchKit.get failure with the APIs", async () => {
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor({
        getImpl: async () => {
          throw new Error("Failed to get switch");
        },
      }),
    });

    await client.init();

    let result = await client.get("key");

    expect(result).toBeUndefined();
    expect(consoleErrors.length).toBe(1);
    expect(consoleErrors[0]).toMatch(/Unable to get switch/);
  });

  test("switchKit.set", async () => {
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor(),
    });

    await client.init();

    await client.set({
      key: "key1",
      value: "value1",
    });

    let result = await client.get("key1");
    // cache hit
    expect(result).toBeDefined();
    expect(result?.value).toBe("value1");
    expect(Object.keys(result?.metadata as SwitchMetadata).length).toBe(0);
  });

  test("switchKit.set error", async () => {
    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor({
        setImpl: async () => {
          throw new Error("Failed to set switch");
        },
      }),
    });

    await client.init();

    await client.set({
      key: "key",
      value: "value",
    });

    expect(consoleErrors.length).toBe(1);
    expect(consoleErrors[0]).toMatch(/Unable to set switch/);
  });

  test("switchKit.clearCache", async () => {
    let count = 0;

    let client = new SwitchKit({
      adaptor: new TestStorageAdaptor({
        getImpl: async () => {
          count++;
          return {
            value: "value",
            metadata: {
              key: "value",
            },
          };
        },
      }),
    });

    await client.init();

    let result = await client.get("key");
    expect(count).toBe(1);
    client.clearCache();
    let secondResult = await client.get("key");
    expect(count).toBe(2);

    expect(result).toEqual(secondResult as Switch);
  });
});
