import {mount} from '@vue/test-utils';
import {plugin} from '../helper';
import RunSetup from './components/Run';
import PromiseSetup from './components/Promise';

describe('test composations functions', () => {
  it('use hook when not install', () => {
    try {
      mount(RunSetup);
    } catch (error: any) {
      expect(error.message).toBe('Please first install Api');
    }
  });

  it('run setup', async () => {
    const wrapper = plugin(RunSetup);
    expect(wrapper.find('div').text()).toBe('loading');
    await new Promise(res => setTimeout(res, 100));
    expect(wrapper.find('div').text()).toBe('work');
  });

  it('promise setup', async () => {
    const wrapper = plugin(PromiseSetup);
    await new Promise(res => setTimeout(res, 100));
    expect(wrapper.find('div').text()).toBe('work');
  });
});
