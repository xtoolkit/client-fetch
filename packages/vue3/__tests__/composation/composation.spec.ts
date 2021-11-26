import {plugin} from '../helper';
import RunSetup from './components/Run';
import PromiseSetup from './components/Promise';

describe('test composations functions', () => {
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
