import {Response} from '@client-fetch/core';
import React, {createElement} from 'react';
import {withApi} from '../../helper';

interface Istate {
  x?: number;
  req: Response;
  req2: Response;
  req3: Response;
}

class Basic extends React.Component<any, Istate> {
  private name = 'foo';

  api = {
    req: {
      manual: true,
      url: '/',
      method: 'get'
    },
    req2(this: Basic) {
      const self = this;
      return {
        method: 'graphql',
        input: {
          query: ''
        },
        onResponse(this: any, data: any) {
          this.data = data.data + '-' + self.name;
        }
      };
    },
    req3: {}
  };

  render() {
    if (this.state.req.loading || this.state.req2.loading) {
      return createElement('div', {}, 'loading');
    }

    return createElement(
      'div',
      {},
      this.state.req.data + '-' + this.state.req2.data
    );
  }
}

export default withApi(Basic);
