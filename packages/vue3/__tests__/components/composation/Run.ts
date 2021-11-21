import {useRunApi} from '../../helper';
import {defineComponent} from 'vue';

export default defineComponent({
  template: `<div>{{ res.data }}</div>`,
  setup() {
    const res = useRunApi('manual', {
      url: '/',
      method: 'get'
    });
    return {res};
  }
});
