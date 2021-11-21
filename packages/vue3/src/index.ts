import {Api} from '@client-fetch/core';
import {stateManager} from './state';
import {Mixin} from './mixin';
export {useApi} from './inject/api';
export {useRunApi} from './inject/run';
export {usePromiseApi} from './inject/promise';
import type {App, Plugin} from 'vue';
import type {Request, ApiOptions} from '@client-fetch/core';
import type {_ApiObjectInput} from './mixin';

export const install: Plugin = (
  app: App,
  request: Request,
  options?: ApiOptions
) => {
  const api = new Api<App>(options || {}, stateManager, request);
  api.setApp(app);
  app.provide('client-fetch', api);
  app.mixin(Mixin);
};

declare module '@vue/runtime-core' {
  export interface ComponentCustomOptions {
    api?: _ApiObjectInput;
  }

  export interface ComponentCustomProperties {
    $api: Api;
  }
}
