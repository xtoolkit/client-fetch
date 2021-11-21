import type {ApiState} from '@client-fetch/core';
import {ref} from 'vue';

export const stateManager: ApiState = {
  createState<T>(data: T) {
    return ref<T>(data);
  },
  getState<T>(data: any): T {
    return data.value;
  }
};
