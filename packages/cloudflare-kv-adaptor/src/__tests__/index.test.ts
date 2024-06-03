import type { Switch, SwitchMetadata } from "@switch-kit/storage-interface";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { SwitchKit } from "switch-kit";
import { CloudflareKV, CloudflareKVAdaptor } from "../index";

describe("CloudflareKV", () => {
  test("it should construct a KV client", () => {
    let requests = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    // implementation detail - but we just want to make sure that we get here
    expect(client.accountID).toBe("account-id");
  });

  test("client.listNamespaces", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.listNamespaces({
      direction: "asc",
      order: "title",
      page: 1,
      perPage: 10,
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces?direction=asc&order=title&page=1&per_page=10",
    );
    // @ts-expect-error - it doesn't know that keys returns an iterable in all cases
    expect([...(requests[0].init?.headers?.keys() || [])]).toMatchObject(["authorization", "content-type"]);
  });

  test("client.createNamespace", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.createNamespace({
      title: "namespace-title",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces",
    );
    expect(requests[0].init?.method).toBe("POST");
    expect(requests[0].init?.body).toBe(JSON.stringify({ title: "namespace-title" }));
  });

  test("client.removeNamespace", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.removeNamespace({
      namespaceID: "namespace-id",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id",
    );
    expect(requests[0].init?.method).toBe("DELETE");
  });

  test("client.renameNamespace", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.renameNamespace({
      namespaceID: "namespace-id",
      title: "new-namespace-title",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id",
    );
    expect(requests[0].init?.method).toBe("PUT");
    expect(requests[0].init?.body).toBe(JSON.stringify({ title: "new-namespace-title" }));
  });

  test("client.deleteKeys", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.deleteKeys({
      namespaceID: "namespace-id",
      keys: ["key1", "key2"],
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id/bulk",
    );
    expect(requests[0].init?.method).toBe("DELETE");
    expect(requests[0].init?.body).toBe(JSON.stringify(["key1", "key2"]));
  });

  test("client.bulkWrite", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.bulkWrite({
      namespaceID: "namespace-id",
      data: [
        {
          key: "key1",
          value: "value1",
        },
        {
          key: "key2",
          value: "value2",
        },
      ],
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id/bulk",
    );
    expect(requests[0].init?.method).toBe("PUT");
    expect(requests[0].init?.body).toBe(
      JSON.stringify([{ key: "key1", value: "value1" }, { key: "key2", value: "value2" }]),
    );
  });

  test("client.listKeys", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.listKeys({
      namespaceID: "namespace-id",
      cursor: "cursor",
      limit: 10,
      prefix: "prefix",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id/keys?cursor=cursor&limit=10&prefix=prefix",
    );
  });

  test("client.readMetadata", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.readMetadata({
      namespaceID: "namespace-id",
      key: "key!:",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id/metadata/key!%3A",
    );
  });

  test("client.deleteKey", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.deleteKey({
      namespaceID: "namespace-id",
      key: "key!:",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id/values/key!%3A",
    );
    expect(requests[0].init?.method).toBe("DELETE");
  });

  test("client.readKey", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.readKey({
      namespaceID: "namespace-id",
      key: "key!:",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id/values/key!%3A",
    );
  });

  test("client.writeKeyWithMetadata", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    let client = new CloudflareKV({
      accountID: "account-id",
      authToken: "auth-token",
      fetch: mockFetch as unknown as typeof globalThis.fetch,
    });

    await client.writeKeyWithMetadata({
      namespaceID: "namespace-id",
      key: "key!:",
      value: "value",
      metadata: { metadata: "value" },
    });

    expect(requests).toHaveLength(1);
    expect(requests[0].input).toMatch(
      "https://api.cloudflare.com/client/v4/accounts/account-id/storage/kv/namespaces/namespace-id/values/key!%3A",
    );
    expect(requests[0].init?.method).toBe("PUT");
    // expect(requests[0].init?.headers?.get("content-type")).toBe(
    //   "multipart/form-data boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    // );
    // @ts-expect-error - it doesn't know that headers is a Headers object
    expect(requests[0].init?.headers?.get("authorization")).toBe("Bearer auth-token");
    let expectedBody = new FormData();
    expectedBody.append("value", "value");
    expectedBody.append("metadata", JSON.stringify({ metadata: "value" }));
    expect(requests[0].init?.body).toStrictEqual(expectedBody);
  });
});

describe("CloudflareKVAdaptor", () => {
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
    let requests = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response();
    }
    expect(() => {
      new SwitchKit({
        adaptor: new CloudflareKVAdaptor({
          namespace: "my-namespace",
          accountID: "account-id",
          authToken: "auth-token",
          fetch: mockFetch as unknown as typeof globalThis.fetch,
        }),
      });
    }).not.toThrow();
  });

  test("switchKit.init", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    expect(requests).toHaveLength(1);
    expect(client.initialized).toBe(true);
  });

  test("switchKit.init failure", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      return new Response(
        JSON.stringify({
          errors: [
            {
              code: 7003,
              message: "No route for the URI",
            },
          ],
          messages: [],
          result: null,
          success: false,
        }),
        {
          status: 400,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    expect(requests).toHaveLength(1);
    expect(client.initialized).toBe(false);
    expect(consoleErrors.length).toBe(1);
    expect(consoleErrors[0]).toMatch(/Failed to initialize SwitchKit client/);
  });

  test("switchKit.init with an existing namespace", async () => {
    let count = 0;
    function getStubNamespaces(length: number) {
      return Array.from({ length }, () => {
        return {
          id: `${count++}`.padStart(10, "0"),
          title: `some-namespace-${Math.random() * 1000}`,
          supports_url_encoding: true,
        };
      });
    }
    let kvNamespaces = [
      ...getStubNamespaces(150),
      {
        id: "123456789",
        title: "my-namespace",
        supports_url_encoding: true,
      },
      ...getStubNamespaces(150),
    ];

    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("namespaces") && init?.method === "POST") {
        return new Response(
          JSON.stringify({
            result: null,
            success: false,
            errors: [
              {
                code: 10014,
                message: "create namespace: 'a namespace with this account ID and title already exists'",
              },
            ],
            messages: [],
          }),
          {
            status: 400,
          },
        );
      }
      if (input.toString().includes("namespaces") && init?.method === "GET") {
        let requestURL = new URL(input.toString());
        let page = requestURL.searchParams.get("page") || "1";
        let start = (Number(page) - 1) * 20;
        let end = start + 20;
        return new Response(
          JSON.stringify({
            result: kvNamespaces.slice(start, end),
            success: true,
            errors: [],
            messages: [],
            result_info: {
              page: Number(page),
              per_page: 20,
              count: kvNamespaces.length,
              total_count: kvNamespaces.length,
              total_pages: Math.ceil(kvNamespaces.length / 20),
            },
          }),
          {
            status: 200,
          },
        );
      }
      return new Response(JSON.stringify({}), { status: 500 });
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    expect(client.initialized).toBe(true);

    let numOfRequests = requests.length;

    await client.init();

    // Didn't make any more requests
    expect(requests.length).toBe(numOfRequests);
  });

  test("switchKit.get", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("metadata")) {
        return new Response(
          JSON.stringify({
            result: {
              key: "value",
            },
          }),
          {
            status: 200,
          },
        );
      }
      if (
        input.toString().includes("values")
      ) {
        return new Response(
          "value",
          {
            status: 200,
          },
        );
      }
      // create namespace
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    let result = await client.get("key");

    expect(result).toBeDefined();
    expect(requests.length).toBe(3);
    expect(result?.value).toBe("value");
    expect(result?.metadata).toMatchObject({ key: "value" });
  });

  test("switchKit.get cached request", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("metadata")) {
        return new Response(
          JSON.stringify({
            result: {
              metadata: {
                key: "value",
              },
            },
          }),
          {
            status: 200,
          },
        );
      }
      if (
        input.toString().includes("values")
      ) {
        return new Response(
          "value",
          {
            status: 200,
          },
        );
      }
      // create namespace
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    let result = await client.get("key");
    let secondResult = await client.get("key");

    expect(result).toEqual(secondResult as Switch);
    expect(requests.length).toBe(3);
  });

  test("switchKit.get not initialized", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("metadata")) {
        return new Response(
          JSON.stringify({
            result: {
              metadata: {
                key: "value",
              },
            },
          }),
          {
            status: 200,
          },
        );
      }
      if (
        input.toString().includes("values")
      ) {
        return new Response(
          "value",
          {
            status: 200,
          },
        );
      }
      // create namespace
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    // intentionally missing init call!

    expect(async () => {
      await client.get("key");
    }).toThrowError(/SwitchKit is not initialized/);
  });

  test("switchKit.get failure with the APIs", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("metadata")) {
        return new Response(
          JSON.stringify({
            errors: [{ code: 7003, message: "No route for the URI" }],
          }),
          {
            status: 400,
          },
        );
      }
      if (
        input.toString().includes("values")
      ) {
        return new Response(
          "value",
          {
            status: 200,
          },
        );
      }
      // create namespace
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    let result = await client.get("key");

    expect(result).toBeUndefined();
    expect(consoleErrors.length).toBe(1);
    expect(consoleErrors[0]).toMatch(/Unable to get switch/);
  });

  test("switchKit.set", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("metadata")) {
        return new Response(
          JSON.stringify({
            result: {},
          }),
          {
            status: 200,
          },
        );
      }
      if (
        input.toString().includes("values")
      ) {
        if (init?.method === "PUT") {
          return new Response(
            JSON.stringify({
              success: true,
            }),
            {
              status: 200,
            },
          );
        }
        return new Response(
          "value",
          {
            status: 200,
          },
        );
      }
      // create namespace
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    await client.set({
      key: "key",
      value: "value",
    });

    // 1 for init
    // 1 for set
    expect(requests.length).toBe(2);

    let result = await client.get("key");
    // cache hit
    expect(requests.length).toBe(2);
    expect(result).toBeDefined();
    expect(result?.value).toBe("value");
    expect(Object.keys(result?.metadata as SwitchMetadata).length).toBe(0);
  });

  test("switchKit.set error", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("metadata")) {
        return new Response(
          JSON.stringify({
            result: {
              key: "value",
            },
          }),
          {
            status: 200,
          },
        );
      }
      if (
        input.toString().includes("values")
      ) {
        if (init?.method === "PUT") {
          return new Response(
            JSON.stringify({
              success: true,
            }),
            {
              status: 400,
            },
          );
        }
        return new Response(
          "value",
          {
            status: 200,
          },
        );
      }
      // create namespace
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    await client.set({
      key: "key",
      value: "value",
    });

    // 1 for init
    // 1 for set
    expect(requests.length).toBe(2);

    expect(consoleErrors.length).toBe(1);
    expect(consoleErrors[0]).toMatch(/Unable to set switch/);
  });

  test("switchKit.clearCache", async () => {
    let requests: Array<{ input: string | Request | URL; init?: RequestInit }> = [];
    async function mockFetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
      requests.push({ input, init });
      if (input.toString().includes("metadata")) {
        return new Response(
          JSON.stringify({
            result: {
              metadata: {
                key: "value",
              },
            },
          }),
          {
            status: 200,
          },
        );
      }
      if (
        input.toString().includes("values")
      ) {
        return new Response(
          "value",
          {
            status: 200,
          },
        );
      }
      // create namespace
      return new Response(
        JSON.stringify({
          result: {
            id: "namespace-id",
          },
        }),
        {
          status: 200,
        },
      );
    }
    let client = new SwitchKit({
      adaptor: new CloudflareKVAdaptor({
        namespace: "my-namespace",
        accountID: "account-id",
        authToken: "auth-token",
        fetch: mockFetch as unknown as typeof globalThis.fetch,
      }),
    });

    await client.init();

    let result = await client.get("key");
    client.clearCache();
    let secondResult = await client.get("key");

    expect(result).toEqual(secondResult as Switch);
    // 1 for init
    // 2 for first get
    // 2 for second get
    expect(requests.length).toBe(5);
  });
});
