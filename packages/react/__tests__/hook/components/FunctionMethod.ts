import {createElement, useState} from 'react';
import {useRunApi} from '../../helper';
import type {RequestInput} from '@client-fetch/core';

function user(this: any, name: string): RequestInput {
  return {
    url: '/user/' + name + '/' + this.name,
    method: 'get'
  };
}

export default function FunctionMethod() {
  const [url, setUrl] = useState('notWork');
  const req = useRunApi(user, {
    input: 'foo',
    onRequest() {
      setUrl(this.url);
    }
  });

  if (req.loading) {
    return createElement('div', {}, 'loading');
  }

  return createElement('div', {}, url);
}
