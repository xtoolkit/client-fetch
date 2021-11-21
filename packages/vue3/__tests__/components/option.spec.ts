import {plugin} from '../helper';
import BasicComponent from './option/Basic';
import BindComponent from './option/Bind';

describe('option api components test', () => {
  it('basic', async () => {
    const wrapper = plugin(BasicComponent, {});
    expect(wrapper.find('div').text()).toBe('loading');
    await new Promise(res => setTimeout(res, 100));
    expect(wrapper.find('div').text()).toBe('work-work-work');
  });

  it('cancel', async () => {
    const wrapper = plugin(BasicComponent);
    await new Promise(res => setTimeout(res, 10));
    wrapper.unmount();
  });

  it('bind component', async () => {
    const wrapper = plugin(BindComponent);
    await new Promise(res => setTimeout(res, 100));
    expect(wrapper.find('div').text()).toBe('work');
  });
});
