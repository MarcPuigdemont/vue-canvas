import { shallowMount } from '@vue/test-utils';
import Handler from '@/components/Handler.vue';

const mockItem = {
  x: 30,
  y: 60,
  w: 120,
  h: 100,
  type: 'IMAGE',
  model: { url: 'http://localhost:8000/images/uploads-1462948453043.png' },
};

describe('Handler Component', () => {
  it('computes the style properly', () => {
    const wrapper = shallowMount(Handler, {
      propsData: {
        item: mockItem,
      },
    });
    const model = wrapper.vm as any;
    expect(model.style).toEqual({ height: '100px', transform: 'translate(31px, 61px)', width: '120px'});
  });

  it('emits a deleteItem event when clicking the delete icon', () => {
    const wrapper = shallowMount(Handler, {
      propsData: {
        item: mockItem,
      },
    });
    const event = {
      stopPropagation: jest.fn(),
    };
    expect(wrapper.emitted().deleteItem).toBeFalsy();
    wrapper.find('.handler-delete').trigger('mousedown', event);
    expect(wrapper.emitted().deleteItem).toBeTruthy();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});
