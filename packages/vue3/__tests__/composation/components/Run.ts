import {useRunApi} from '../../helper';
import {defineComponent} from 'vue';

export default defineComponent({
  template: `
    <div v-if="res.loading">loading</div>
    <div>{{ res.data }}</div>
  `,
  setup() {
    const res = useRunApi('manual', {
      url: '/',
      method: 'get',
      onEach() {}
    });
    return {res};
  }
});
