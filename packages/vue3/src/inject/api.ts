import {Api} from '@client-fetch/core';
import {inject} from 'vue';

export function useApi() {
  const api = inject<Api>('client-fetch');
  if (!api) {
    throw new Error('Please first install Api');
  }
  return api;
}
