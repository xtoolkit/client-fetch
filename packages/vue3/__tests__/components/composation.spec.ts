import {plugin} from '../helper';
import BasicSetup from './composation/Basic';
import RunSetup from './composation/Run';
import PromiseSetup from './composation/Promise';

describe('test composations functions', () => {
  it('basic setup', async () => {
    const wrapper = plugin(BasicSetup);
    await new Promise(res => setTimeout(res, 100));
    expect(wrapper.find('div').text()).toBe('work');
  });

  it('run setup', async () => {
    const wrapper = plugin(RunSetup);
    await new Promise(res => setTimeout(res, 100));
    expect(wrapper.find('div').text()).toBe('work');
  });

  it('promise setup', async () => {
    const wrapper = plugin(PromiseSetup);
    await new Promise(res => setTimeout(res, 100));
    expect(wrapper.find('div').text()).toBe('work');
  });
});
