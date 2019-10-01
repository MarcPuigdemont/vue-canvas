import { shallowMount } from '@vue/test-utils';
import CanvasItemText from '@/components/CanvasItemText.vue';

const mockItem = {
  x: 10,
  y: 10,
  w: 200,
  h: 40,
  type: 'TEXT',
  model: { text: 'This is a text' },
};

describe('CanvasItemText Component', () => {
  it('renders properly', () => {
    const wrapper = shallowMount(CanvasItemText, {
      propsData: {
        item: mockItem,
      },
    });
    expect(wrapper.text()).toBe('This is a text');
  });
});
