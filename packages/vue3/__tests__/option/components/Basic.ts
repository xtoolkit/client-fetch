import {defineComponent} from 'vue';

export default defineComponent({
  template: `
    <div v-if="req.loading || req2.loading || req3.loading">loading</div>
    <div v-else>{{ req.data }}-{{ req2.data }}-{{ req3.data }}</div>
    <div v-if="!req4.loading">notWork</div>
  `,
  api: {
    req: {
      manual: true,
      method: 'get',
      url: '/',
      onEach() {}
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
    },
    req4: {}
  }
});
