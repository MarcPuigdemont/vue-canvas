import { shallowMount } from '@vue/test-utils';
import CanvasItemImage from '@/components/CanvasItemImage.vue';

const mockItem = {
  x: 30,
  y: 60,
  w: 120,
  h: 100,
  type: 'IMAGE',
  model: { url: 'http://localhost:8000/images/uploads-1462948453043.png' },
};

describe('CanvasItem Component', () => {
  it('computes the style properly', () => {
    const wrapper = shallowMount(CanvasItemImage, {
      propsData: {
        item: mockItem,
      },
    });
    const model = wrapper.vm as any;
    expect(model.style).toEqual({
      backgroundImage: 'url(http://localhost:8000/images/uploads-1462948453043.png)',
    });
  });
});
