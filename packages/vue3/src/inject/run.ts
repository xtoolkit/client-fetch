import {Api} from '@client-fetch/core';
import {inject} from 'vue';

export const useRunApi: Api['run'] = (method: any, input: any) => {
  return inject<Api>('client-fetch')!!.run(method, input);
};
