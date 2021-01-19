export type nodeArg = { argsBefore?: string[]; argsAfter?: string[] };
export type eletronArg = { argsBefore?: string[]; argsAfter?: string[] };
export type builderType = "CLIENT" | "NODEJS" | "SINGLE" | "ELECTRON";
export type builderConfig = {
  watch: string;
  launch?: boolean;
  launchArg?: nodeArg;
  transmitt?: string;
  listen?: string;
};

export type nodejsConfig = {
  watch: string;
  launch?: boolean;
  launchArg?: nodeArg;
  transmitt?: string;
  listen?: string;
};

export type clientConfig = {
  watch: string;
  transmitt?: string;
  listen?: string;
};

export type electronConfig = {
  watch: string;
  launch?: boolean;
  launchArg?: eletronArg;
  transmitt?: string;
  listen?: string;
};

export type singleConfig = {
  watch: string;
  name?: string;
  transmitt?: string;
  listen?: string;
};
