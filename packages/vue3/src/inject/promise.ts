import {Api} from '@client-fetch/core';
import {inject} from 'vue';

export const usePromiseApi: Api['promise'] = (method: any, input: any) => {
  return inject<Api>('client-fetch')!!.promise(method, input);
};
