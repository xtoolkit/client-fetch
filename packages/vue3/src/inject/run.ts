import {Api} from '@client-fetch/core';
import {ref, unref} from 'vue';
import {useApi} from './api';
import type {ExecutesArgs, ExecuteMethod} from '@client-fetch/core';

export function useRunApi<Fn extends ExecuteMethod | undefined = undefined>(
  ...[method, input]: ExecutesArgs<Fn>
) {
  const state = ref(Api.createRes());
  const onEach = function (this: any) {
    input?.onEach?.apply(this);
    state.value = {...unref(this)};
  };
  // @ts-ignore
  useApi().execute(method, {...input, onEach});
  return state;
}
