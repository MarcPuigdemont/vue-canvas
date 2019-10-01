import { mount, shallowMount } from '@vue/test-utils';
import Canvas from '@/components/Canvas.vue';
import axios from 'axios';

const item = (x: number, y: number, w: number, h: number, type: string, model: any) => ({ x, y, w, h, type, model });
const url = (url: string) => `http://localhost:8000/images/${url}`;
const mockItems = [
  item(10, 10, 200, 40, 'TEXT', { text: 'This is a text' }),
  item(30, 60, 120, 100, 'IMAGE', { url: url('uploads-1462948453043.png') }),
  item(100, 200, 100, 60, 'TEXT', { text: 'This is another text' }),
  item(400, 50, 120, 180, 'IMAGE', { url: url('uploads-1462948491987.png') }),
];
jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: mockItems })),
}));

describe('Canvas Component', () => {
  it('gets the items from the server', done => {
    expect(axios.get).not.toBeCalled();
    const wrapper = mount(Canvas);
    expect(axios.get).toBeCalled();
    wrapper.vm.$nextTick(() => {
      const model = wrapper.vm as any;
      expect(model.items).toBe(mockItems);
      done();
    });
  });

  it('renders the items properly', () => {
    const wrapper = shallowMount(Canvas);
    wrapper.setData({
      items: mockItems,
    });

    const items = wrapper.findAll('div.canvas div.block div.item');
    expect(items.length).toBe(4);
    const images = wrapper.findAll('div.canvas div.block div.item div.item-image');
    expect(images.length).toBe(2);
    const imageStyle = images.at(0).element.style as any;
    expect(imageStyle._values).toEqual({'background-image': 'url(http://localhost:8000/images/uploads-1462948453043.png)'});
    const texts = wrapper.findAll('div.canvas div.block div.item div.item-text');
    expect(texts.length).toBe(2);
    expect(texts.at(0).text()).toBe('This is a text');
    expect(texts.at(1).text()).toBe('This is another text');
  });
});