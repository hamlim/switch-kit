import type { StorageAdaptor, Switch, SwitchMetadata } from "@switch-kit/storage-interface";

// SECTION: CloudflareKV

export type CloudflareKVOptions = {
  authToken: string;
  accountID: string;
  apiBaseURL?: string;
  fetch?: typeof globalThis.fetch;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-list-namespaces
export type ListNamespacesOptions = {
  direction?: "asc" | "desc";
  order?: "id" | "title";
  page?: number;
  perPage?: number;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-create-a-namespace
export type CreateNamespaceOptions = {
  title: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-remove-a-namespace
export type RemoveNamespaceOptions = {
  namespaceID: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-rename-a-namespace
export type RenameNamespaceOptions = {
  namespaceID: string;
  title: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-delete-multiple-key-value-pairs
export type DeleteKeysOptions = {
  keys: Array<string>;
  namespaceID: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-write-multiple-key-value-pairs
export type BulkWriteOptions = {
  namespaceID: string;
  data: Array<{
    base64?: boolean;
    expiration?: number;
    expirationTTL?: number;
    metadata?: Record<string, string>;
    key: string;
    value: string;
  }>;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-list-a-namespace'-s-keys
export type ListKeysOptions = {
  namespaceID: string;
  cursor?: string;
  limit?: number;
  prefix?: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-read-the-metadata-for-a-key
export type ReadMetadataOptions = {
  key: string;
  namespaceID: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-delete-key-value-pair
export type DeleteKeyOptions = {
  key: string;
  namespaceID: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-read-key-value-pair
export type ReadKeyOptions = {
  key: string;
  namespaceID: string;
};

// @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-write-key-value-pair-with-metadata
export type WriteKeyWithMetadataOptions = {
  key: string;
  namespaceID: string;
  value: string;
  metadata: Record<string, string | number | boolean>;
};

export class CloudflareKV {
  fetch: typeof globalThis.fetch;
  authToken: string;
  accountID: string;
  apiBaseURL: string;

  baseRequestHeaders: Headers;

  constructor({
    authToken,
    accountID,
    apiBaseURL = "https://api.cloudflare.com/client/v4",
    fetch = globalThis.fetch,
  }: CloudflareKVOptions) {
    this.fetch = fetch;
    this.authToken = authToken;
    this.accountID = accountID;
    this.apiBaseURL = apiBaseURL;

    this.baseRequestHeaders = new Headers({
      Authorization: `Bearer ${this.authToken}`,
      "Content-Type": "application/json",
    }) as unknown as Headers;
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-list-namespaces
  async listNamespaces({
    direction,
    order,
    page,
    perPage,
  }: ListNamespacesOptions): Promise<Response> {
    let params = new URLSearchParams();
    if (direction) {
      params.set("direction", direction);
    }
    if (order) {
      params.set("order", order);
    }
    if (page) {
      params.set("page", page.toString());
    }
    if (perPage) {
      params.set("per_page", perPage.toString());
    }
    let url = new URL(`${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces`);
    if (params.toString()) {
      url.search = params.toString();
    }
    return this.fetch(url.toString(), {
      method: "GET",
      headers: this.baseRequestHeaders,
    });
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-create-a-namespace
  async createNamespace({
    title,
  }: CreateNamespaceOptions): Promise<Response> {
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces`,
      {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: this.baseRequestHeaders,
      },
    );
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-remove-a-namespace
  async removeNamespace({
    namespaceID,
  }: RemoveNamespaceOptions): Promise<Response> {
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}`,
      {
        method: "DELETE",
        headers: this.baseRequestHeaders,
      },
    );
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-rename-a-namespace
  async renameNamespace({
    namespaceID,
    title,
  }: RenameNamespaceOptions): Promise<Response> {
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}`,
      {
        method: "PUT",
        body: JSON.stringify({ title }),
        headers: this.baseRequestHeaders,
      },
    );
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-delete-multiple-key-value-pairs
  async deleteKeys({
    keys,
    namespaceID,
  }: DeleteKeysOptions): Promise<Response> {
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}/bulk`,
      {
        method: "DELETE",
        body: JSON.stringify(keys),
        headers: this.baseRequestHeaders,
      },
    );
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-write-multiple-key-value-pairs
  async bulkWrite({
    namespaceID,
    data,
  }: BulkWriteOptions): Promise<Response> {
    return this.fetch(`${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}/bulk`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: this.baseRequestHeaders,
    });
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-list-a-namespace'-s-keys
  async listKeys({
    namespaceID,
    cursor,
    limit,
    prefix,
  }: ListKeysOptions): Promise<Response> {
    let params = new URLSearchParams();

    if (cursor) {
      params.set("cursor", cursor);
    }
    if (limit) {
      params.set("limit", limit.toString());
    }
    if (prefix) {
      params.set("prefix", prefix);
    }
    let url = new URL(`${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}/keys`);
    if (params.toString()) {
      url.search = params.toString();
    }
    return this.fetch(url.toString(), {
      method: "GET",
      headers: this.baseRequestHeaders,
    });
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-read-the-metadata-for-a-key
  async readMetadata({
    key,
    namespaceID,
  }: ReadMetadataOptions): Promise<Response> {
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}/metadata/${
        encodeURIComponent(key)
      }`,
      {
        method: "GET",
        headers: this.baseRequestHeaders,
      },
    );
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-delete-key-value-pair
  async deleteKey({
    namespaceID,
    key,
  }: DeleteKeyOptions): Promise<Response> {
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}/values/${
        encodeURIComponent(key)
      }`,
      {
        method: "DELETE",
        headers: this.baseRequestHeaders,
      },
    );
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-read-key-value-pair
  async readKey({
    key,
    namespaceID,
  }: ReadKeyOptions): Promise<Response> {
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}/values/${
        encodeURIComponent(key)
      }`,
      {
        method: "GET",
        headers: this.baseRequestHeaders,
      },
    );
  }

  // @SEE: https://developers.cloudflare.com/api/operations/workers-kv-namespace-write-key-value-pair-with-metadata
  async writeKeyWithMetadata({
    key,
    namespaceID,
    value,
    metadata,
  }: WriteKeyWithMetadataOptions): Promise<Response> {
    let body = new FormData();
    body.append("value", value);
    body.append("metadata", JSON.stringify(metadata));
    return this.fetch(
      `${this.apiBaseURL}/accounts/${this.accountID}/storage/kv/namespaces/${namespaceID}/values/${
        encodeURIComponent(key)
      }`,
      {
        method: "PUT",
        body,
        headers: new Headers({
          Authorization: `Bearer ${this.authToken}`,
        }),
      },
    );
  }
}

type ListNamespacesResponse = {
  result: Array<{ id: string; title: string; supports_url_encoding: boolean }>;
  result_info: {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
    total_pages: number;
  };
};

// SECTION: CloudflareKVAdaptor
export type CloudflareKVAdaptorOptions = {
  // the title of the namespace that is used to store the switches
  namespace: string;
  // The options forwarded onto the CloudflareKV constructor
  authToken: string;
  accountID: string;
  apiBaseURL?: string;
  fetch?: typeof globalThis.fetch;
};

/**
 * CloudflareKVAdaptor is a SwitchKit Adaptor for Cloudflare KV.
 *
 * Here's an example snippet of how to use SwitchKit with the @switch-kit/cloudflare-kv-adaptor package:
 *
 * ```tsx
 * let switchKit = new SwitchKit({
 *   namespace: "my-switches",
 *   adaptor: new CloudflareKVAdaptor({
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
 */
export class CloudflareKVAdaptor implements StorageAdaptor {
  cloudflareKV: CloudflareKV;
  namespace: string;
  namespaceID?: string;
  initialized = false;

  constructor({
    namespace,
    ...options
  }: CloudflareKVAdaptorOptions) {
    this.cloudflareKV = new CloudflareKV(options);
    this.namespace = namespace;
  }

  async findNamespace(namespace: string, page = 1): Promise<ListNamespacesResponse["result"][0]> {
    // Search through all pages of the `listNamespaces` response to find the desired namespace
    let namespacesResponse = await this.cloudflareKV.listNamespaces({
      direction: "asc",
      order: "title",
      page,
    });

    if (!namespacesResponse.ok) {
      let namespacesPayload = {
        errors: [{ code: 0, message: "unknown" }],
      };
      try {
        namespacesPayload = await namespacesResponse.json() as { errors: Array<{ code: number; message: string }> };
      } catch (err) {
        // noop
      }
      throw new Error(
        `Unable to list namespaces: ${namespacesResponse.statusText}\n\n${JSON.stringify(namespacesPayload, null, 2)}`,
      );
    }

    let namespacesResult: Partial<ListNamespacesResponse> = {};
    try {
      namespacesResult = await namespacesResponse.json() as ListNamespacesResponse;
    } catch (err) {
      // noop
    }
    if (!namespacesResult.result || !namespacesResult.result.length) {
      throw new Error("Unable to find namespaces in the response");
    }
    let namespaceData = namespacesResult.result.find((ns) => ns.title === namespace);

    if (namespaceData) {
      return namespaceData;
    }
    if (namespacesResult.result_info && page < namespacesResult.result_info.total_pages) {
      return this.findNamespace(namespace, page + 1);
    }
    throw new Error(`Unable to find namespace: ${namespace}`);
  }

  async init() {
    if (this.initialized) {
      return;
    }
    // Attempt to create the namespace first - if it fails then fallback to getting the list of namespaces, and retrying until we find the right one
    // Cloudflare returns an error with a code of: 10014 (at the time of writing / with this version of the API) when we are attempting to create a
    // namespace that already exists.
    let response = await this.cloudflareKV.createNamespace({
      title: this.namespace,
    });
    if (!response.ok) {
      let payload = {
        errors: [{ code: 0, message: "unknown" }],
      };
      try {
        payload = await response.json() as { errors: Array<{ code: number; message: string }> };
      } catch (err) {
        // noop
      }
      if (!payload.errors.every((error) => error.code === 10014)) {
        throw new Error(`Unable to create namespace: ${response.statusText}\n\n${JSON.stringify(payload, null, 2)}`);
      }
      // Now try listing the namespaces until we find the desired one!
      // This will throw if we get back bad data / errors, letting it do so will allow the error to bubble up
      let namespacesResponse = await this.findNamespace(this.namespace, 1);
      this.namespaceID = namespacesResponse.id;
      this.initialized = true;
      return;
    }
    let data = await response.json() as unknown as {
      errors: Array<{
        code: number;
        message: string;
      }>;
      result: {
        id: string;
        title: string;
        supports_url_encoding: boolean;
      };
      messages: Array<{
        code: number;
        message: string;
      }>;
      success: boolean;
    };
    this.namespaceID = data.result.id;
    this.initialized = true;
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
    if (!this.initialized || !this.namespaceID) {
      throw new Error("SwitchKit is not initialized. Call `init` method first!");
    }

    let [valueResult, metadataResult] = await Promise.allSettled([
      this.cloudflareKV.readKey({
        key,
        namespaceID: this.namespaceID,
      }),
      this.cloudflareKV.readMetadata({
        key,
        namespaceID: this.namespaceID,
      }),
    ]);
    if (
      valueResult.status === "rejected"
      || metadataResult.status === "rejected"
      || !valueResult.value.ok
      || !metadataResult.value.ok
    ) {
      let payload: {
        errors: Array<{
          code: number;
          message: string;
        }>;
      } = {
        errors: [],
      };
      if (valueResult.status === "rejected") {
        payload.errors.push(valueResult.reason);
      }
      if (metadataResult.status === "rejected") {
        payload.errors.push(metadataResult.reason);
      }
      if (valueResult.status === "fulfilled" && !valueResult.value.ok) {
        try {
          let errorResponse = await valueResult.value.json() as unknown as {
            errors: Array<{ code: number; message: string }>;
          };
          payload.errors.push(
            ...(errorResponse?.errors || []),
          );
        } catch (err) {
          // noop
        }
      }

      if (metadataResult.status === "fulfilled" && !metadataResult.value.ok) {
        try {
          let errorResponse = await metadataResult.value.json() as unknown as {
            errors: Array<{ code: number; message: string }>;
          };
          payload.errors.push(
            ...(errorResponse?.errors || []),
          );
        } catch (err) {
          // noop
        }
      }
      throw new Error(`Failed to load switch value and/or metadata"\n\n${JSON.stringify(payload, null, 2)}`);
    }
    let [valueData, metadataData] = await Promise.all([
      valueResult.value.text(),
      metadataResult.value.json() as Promise<{ result: SwitchMetadata }>,
    ]);
    let switchValue: Switch = {
      value: valueData,
      metadata: metadataData.result,
    };
    return switchValue;
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
    if (!this.initialized || !this.namespaceID) {
      throw new Error("SwitchKit is not initialized. Call `init` method first!");
    }
    let res = await this.cloudflareKV.writeKeyWithMetadata({
      key,
      namespaceID: this.namespaceID,
      value,
      metadata,
    });
    if (!res.ok) {
      let payload = {
        errors: [{ code: 0, message: "unknown" }],
      };
      try {
        payload = await res.json() as unknown as { errors: Array<{ code: number; message: string }> };
      } catch (err) {
        // noop
      }
      throw new Error(`Failed to write key with metadata\n\n${JSON.stringify(payload, null, 2)}`);
    }
  }
}
