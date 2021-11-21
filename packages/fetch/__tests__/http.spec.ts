import fetchRequest from '../src';
import {requestTest} from '../../core/__tests__/helper.request';

describe('http request test', () => {
  requestTest(fetchRequest);
});
