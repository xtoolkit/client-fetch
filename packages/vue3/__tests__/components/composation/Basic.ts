import {useApi} from '../../helper';
import {defineComponent} from 'vue';

export default defineComponent({
  template: `<div>{{ res.data }}</div>`,
  setup() {
    const api = useApi();
    const res = api.run('manual', {
      url: '/test',
      method: 'get'
    });
    return {res};
  }
});
