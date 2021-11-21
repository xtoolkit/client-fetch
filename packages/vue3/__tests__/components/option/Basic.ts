import {defineComponent} from 'vue';

export default defineComponent({
  template: `
    <div v-if="req.loading">loading</div>
    <div v-else>{{ req.data }}-{{ req2.data }}-{{ req3.data }}</div>
  `,
  api: {
    req: {
      manual: true,
      method: 'get',
      url: '/'
    },
    req2: {
      method: 'graphql',
      input: {
        query: ''
      }
    },
    req3: {
      method: 'graphql:test',
      input: {
        query: ''
      }
    }
  }
});
