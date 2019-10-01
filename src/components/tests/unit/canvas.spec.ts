import { mount, shallowMount } from '@vue/test-utils';
import Canvas from '@/components/Canvas.vue';
import axios from 'axios';

const item = (x: number, y: number, w: number, h: number, type: string, model: any) => ({ x, y, w, h, type, model });
const url = (imageName: string) => `http://localhost:8000/images/${imageName}`;
const mockItems = [
  item(10, 10, 200, 40, 'TEXT', { text: 'This is a text' }),
  item(30, 60, 120, 100, 'IMAGE', { url: url('uploads-1462948453043.png') }),
  item(100, 200, 100, 60, 'TEXT', { text: 'This is another text' }),
  item(400, 50, 120, 180, 'IMAGE', { url: url('uploads-1462948491987.png') }),
];
jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: mockItems })),
}));
const stubs = { CanvasItem: '<div class="item"></div>' };

describe('Canvas Component', () => {
  it('gets the items from the server', (done) => {
    expect(axios.get).not.toBeCalled();
    const wrapper = mount(Canvas, { stubs });
    expect(axios.get).toBeCalled();
    wrapper.vm.$nextTick(() => {
      const model = wrapper.vm as any;
      expect(model.items).toBe(mockItems);
      done();
    });
  });

  it('renders the items properly', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
    });

    const items = wrapper.findAll('div.canvas div.block div.item');
    expect(items.length).toBe(4);
  });
});
