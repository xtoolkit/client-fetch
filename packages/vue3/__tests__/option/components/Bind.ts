import {defineComponent} from 'vue';

export default defineComponent({
  template: `<div>{{ title }}</div>`,
  data: () => ({
    userId: 100,
    title: 'notWork'
  }),
  api: {
    req() {
      const self = this;
      return {
        manual: true,
        method: 'get',
        url: '/user',
        params: {
          id: this.userId
        },
        onRequest() {
          if (this.params?.id === 100) {
            self.title = 'work';
          }
        }
      };
    }
  }
});
