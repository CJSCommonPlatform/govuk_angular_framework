export interface Window {govUk: any;}

export interface IGovUkGlobalConfig {
  apiRoot?: string;
  errorServer?: string;
  reportErrors?: boolean;
}

export interface IGovUkPermissionsConfig {}

export interface IGovUkBootstrapConfig extends ng.IAngularBootstrapConfig {
  global:      IGovUkGlobalConfig;
  permissions: IGovUkPermissionsConfig;
}