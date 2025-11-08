export interface SipProviderType {
  provider_number: string;
  name: string;
  codecs: string;
  transport: string;
  host: string;
  extension: string;
  prefix?: string;
  concurrentlimit?: number;
  strategy?: string;
}
