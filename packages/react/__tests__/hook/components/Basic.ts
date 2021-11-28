import {createElement} from 'react';
import {useRunApi} from '../../helper';
export default function Basic() {
  const req = useRunApi('manual', {
    url: '/',
    method: 'get'
  });

  if (req.loading) {
    return createElement('div', {}, 'loading');
  }

  return createElement('div', {}, req.data);
}
