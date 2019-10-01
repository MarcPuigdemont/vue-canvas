import { shallowMount } from '@vue/test-utils';
import CanvasItem from '@/components/CanvasItem.vue';
import CanvasItemImage from '@/components/CanvasItemImage.vue';
import CanvasItemText from '@/components/CanvasItemText.vue';

const item = (x: number, y: number, w: number, h: number, type: string, model: any) => ({ x, y, w, h, type, model });
const url = (imageName: string) => `http://localhost:8000/images/${imageName}`;
const mockItems = [
  item(10, 10, 200, 40, 'TEXT', { text: 'This is a text' }),
  item(30, 60, 120, 100, 'IMAGE', { url: url('uploads-1462948453043.png') }),
];

describe('CanvasItem Component', () => {
  it('computes the style properly', () => {
    const wrapper = shallowMount(CanvasItem, {
      propsData: {
        item: mockItems[0],
        selected: false,
      },
    });
    let model = wrapper.vm as any;
    expect(model.style).toEqual({
      transform: 'translate(10px, 10px)',
      width: '200px',
      height: '40px',
      border: 'solid 1px transparent',
      zIndex: 1,
    });
    wrapper.setProps({
      selected: true,
    });
    model = wrapper.vm as any;
    expect(model.style).toEqual({
      transform: 'translate(10px, 10px)',
      width: '200px',
      height: '40px',
      border: 'solid 1px black',
      zIndex: 2,
    });
  });

  it('computes the component properly', () => {
    let wrapper = shallowMount(CanvasItem, {
      propsData: {
        item: mockItems[0],
      },
    });
    let model = wrapper.vm as any;
    expect(model.itemComponent).toEqual(CanvasItemText);

    wrapper = shallowMount(CanvasItem, {
      propsData: {
        item: mockItems[1],
      },
    });
    model = wrapper.vm as any;
    expect(model.itemComponent).toEqual(CanvasItemImage);
  });
});
