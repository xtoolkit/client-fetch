import {State} from '@client-fetch/core';
import {Ref, ref} from 'vue';

export class VueState<T> implements State<T> {
  private state: Ref;
  constructor(data: T) {
    this.state = ref(data);
  }

  getValue(): T {
    return this.state.value;
  }

  update() {}
}
