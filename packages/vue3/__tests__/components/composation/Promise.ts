import {usePromiseApi} from '../../helper';
import {defineComponent, ref} from 'vue';

export default defineComponent({
  template: `<div>{{ title }}</div>`,
  setup() {
    const title = ref<string | null>('notWork');
    usePromiseApi('manual', {
      url: '/',
      method: 'get'
    }).then(res => {
      title.value = res.data;
    });
    return {title};
  }
});
