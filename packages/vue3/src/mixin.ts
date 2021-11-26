import {Api} from '@client-fetch/core';
import {useApi} from './inject/api';
import {useRunApi} from './inject/run';
import {usePromiseApi} from './inject/promise';
import type {ComponentOptions} from 'vue';
import type {ApiObjectInput, Response} from '@client-fetch/core';

type ApiObjectInputBindComponent = (this: ComponentOptions) => ApiObjectInput;

export type _ApiObjectInput = Record<
  string,
  ApiObjectInput | ApiObjectInputBindComponent
>;

export const Mixin: ComponentOptions = {
  beforeCreate() {
    this._api = this.$options.api || false;
    delete this.$options.api;
    if (this._api) {
      this.$api = {
        execute: useApi().execute,
        run: useRunApi,
        promise: usePromiseApi
      };
    }
  },
  data() {
    if (!this._api) {
      return {};
    }
    const o: Record<string, Response> = {};
    for (const item in this._api as _ApiObjectInput) {
      o[item] = Api.createRes();
    }
    return o;
  },
  beforeMount() {
    if (!this._api) {
      return false;
    }
    for (const item in this._api) {
      const api = this._api[item];
      const config = typeof api === 'function' ? api.apply(this) : api;
      this[item] = this.$api.run(
        config.manual ? 'manual' : config.method,
        config
      );
    }
  },
  beforeUnmount() {
    if (!this._api) {
      return false;
    }
    for (const item in this._api) {
      (this[item] as Response).cancel();
    }
  }
};
