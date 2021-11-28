import React, {createElement} from 'react';
import {withApi} from '../../helper';

class Empty extends React.Component {
  render() {
    return createElement('div', {}, 'work');
  }
}

export default withApi(Empty);
