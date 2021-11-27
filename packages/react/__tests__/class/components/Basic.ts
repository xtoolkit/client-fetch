import {Response} from '@client-fetch/core';
import React, {createElement} from 'react';
import {withApi} from '../../helper';

interface Istate {
  req: Response;
}

class Basic extends React.Component<any, Istate> {
  api = {
    req: {
      manual: true,
      url: '/',
      method: 'get'
    }
  };
  render() {
    if (this.state.req.loading) {
      return createElement('div', {}, 'loading');
    }
    return createElement('div', {}, this.state.req.data);
  }
}

export default withApi(Basic);
