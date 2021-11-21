import {Api} from '@client-fetch/core';
import {inject} from 'vue';

export function useApi() {
  return inject<Api>('client-fetch')!!;
}
