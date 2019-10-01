import { mount, shallowMount } from '@vue/test-utils';
import Canvas from '@/components/Canvas.vue';
import axios from 'axios';
import { MouseButton } from '@/types/interfaces';

// tslint:disable-next-line
const createItem = (x: number, y: number, w: number, h: number, type: string, model: any) => ({ x, y, w, h, type, model });
const url = (imageName: string) => `http://localhost:8000/images/${imageName}`;
const mockItems = [
  createItem(10, 10, 200, 40, 'TEXT', { text: 'This is a text' }),
  createItem(30, 60, 120, 100, 'IMAGE', { url: url('uploads-1462948453043.png') }),
  createItem(100, 200, 100, 60, 'TEXT', { text: 'This is another text' }),
  createItem(400, 50, 120, 180, 'IMAGE', { url: url('uploads-1462948491987.png') }),
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

  it('registers and unregisters document events properly', () => {
    // TODO find out how to spy / mock window.document
    // do I really need JSDOM ?
  });

  it('renders the items properly', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
    });

    const items = wrapper.findAll('div.canvas div.block div.item');
    expect(items.length).toBe(4);
  });

  it('validates a new position to be within bounds', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    const model = wrapper.vm as any;
    const item = {
      x: 10,
      y: 10,
      w: 50,
      h: 50,
      type: 'IMAGE',
      model: {},
    };
    expect(model.validatePosition(item, { x: -10, y: -10})).toEqual({ x: 0, y: 0 });
    expect(model.validatePosition(item, { x: 590, y: 0})).toEqual({ x: 548, y: 0 });
    expect(model.validatePosition(item, { x: 590, y: 590})).toEqual({ x: 548, y: 548 });
    expect(model.validatePosition(item, { x: -10, y: 590})).toEqual({ x: 0, y: 548 });
    expect(model.validatePosition(item, { x: 50, y: 50})).toEqual({ x: 50, y: 50 });
  });

  it('gets the proper item from the mouse event', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
    });
    const item = wrapper.findAll('.item').at(1).element;
    const model = wrapper.vm as any;
    const selectedItem = model.getCanvasItemFromEvent({
      currentTarget: { childNodes: [ {}, item, {} ] },
      target: item,
    });
    expect(selectedItem).toBe(mockItems[1]);
  });

  it('computes the dragAnchorPoint and canvasOrigin properly', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
    });
    const item = wrapper.find('.item').element;
    const model = wrapper.vm as any;
    model.startDrag({
      button: MouseButton.LEFT,
      currentTarget: { childNodes: [item] },
      target: item,
      pageX: 15,
      pageY: 15,
      // tslint:disable-next-line
      preventDefault: () => {},
    });
    expect(model.dragAnchorPoint).toEqual({ x: 4, y: 4 });
    expect(model.canvasOrigin).toEqual({ x: 1, y: 1 });
    expect(model.dragging).toBe(true);
    expect(model.selectedItem).toBe(mockItems[0]);
  });

  it('updates selected item position on drag', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: mockItems[0],
      dragging: true,
    });
    const model = wrapper.vm as any;
    model.doDrag({
      pageX: 50,
      pageY: 50,
      // tslint:disable-next-line
      preventDefault: () => {},
    });
    expect(model.selectedItem.x).toBe(50);
    expect(model.selectedItem.y).toBe(50);
  });
});
