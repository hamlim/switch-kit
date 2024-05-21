export type SwitchMetadata = Record<string, string | number | boolean>;

export type Switch = {
  value: string;
  metadata?: SwitchMetadata;
};

export interface StorageAdaptor {
  init(): Promise<void>;
  get(key: string): Promise<Switch | undefined>;
  set({
    key,
    value,
    metadata,
  }: {
    key: string;
    value: string;
    metadata?: SwitchMetadata;
  }): Promise<void>;
}

export interface Storage extends StorageAdaptor {
  clearCache(): void;
}
