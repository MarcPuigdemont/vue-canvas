import { mount, shallowMount } from '@vue/test-utils';
jest.mock('@/utils/services');
import Canvas from '@/components/Canvas.vue';
import { MouseButton } from '@/types/interfaces';
import * as services from '@/utils/services';

declare var global: any;

// tslint:disable-next-line
const createItem = (x: number, y: number, w: number, h: number, type: string, model: any) => ({ x, y, w, h, type, model });
const url = (imageName: string) => `http://localhost:8000/images/${imageName}`;
const mockItems = [
  createItem(10, 10, 200, 40, 'TEXT', { text: 'This is a text' }),
  createItem(30, 60, 120, 100, 'IMAGE', { url: url('uploads-1462948453043.png') }),
  createItem(100, 200, 100, 60, 'TEXT', { text: 'This is another text' }),
  createItem(400, 50, 120, 180, 'IMAGE', { url: url('uploads-1462948491987.png') }),
];
const mockServices = services as any;
const stubs = { CanvasItem: '<div class="item"></div>' };

describe('Canvas Component', () => {
  beforeEach(() => {
    mockServices.itemService.addItem.mockReset();
    mockServices.itemService.updateItem.mockReset();
    mockServices.itemService.deleteItem.mockReset();
  });

  it('renders the items properly', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
    });

    const items = wrapper.findAll('div.canvas div.block div.item');
    expect(items.length).toBe(4);
  });

  it('gets the items from the server', () => {
    const wrapper = mount(Canvas, { stubs });
    const subscriber = mockServices.itemService.getItemServiceSubscriber();
    expect(subscriber).toBeDefined();
    mockItems.forEach((item) => subscriber.next(item));
    const model = wrapper.vm as any;
    expect(model.items).toEqual(mockItems);
  });

  it('registers and unregisters document events', () => {
    global.document.addEventListener = jest.fn();
    global.document.removeEventListener = jest.fn();
    
    const wrapper = mount(Canvas, { stubs });
    expect(global.document.addEventListener).toHaveBeenCalled();
    expect(global.document.addEventListener.mock.calls[0][0]).toBe('mouseup');
    expect(global.document.addEventListener.mock.calls[1][0]).toBe('mousemove');
    expect(global.document.removeEventListener).not.toHaveBeenCalled();
    wrapper.destroy();
    expect(global.document.removeEventListener.mock.calls[0][0]).toBe('mouseup');
    expect(global.document.removeEventListener.mock.calls[1][0]).toBe('mousemove');
  });

  it('recomputes the canvas origin', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    const model = wrapper.vm as any;
    model.recomputeCanvasOrigin();
    expect(model.canvasOrigin).toEqual({ x: 1, y: 1 });
  });

  it('gets the proper item from the mouse event', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
    });
    const item = wrapper.findAll('.item').at(1).element;
    const model = wrapper.vm as any;
    let selectedItem = model.getCanvasItemFromEvent({
      currentTarget: { childNodes: [ {}, item, {} ] },
      target: item,
    });
    expect(selectedItem).toEqual(mockItems[1]);

    selectedItem = model.getCanvasItemFromEvent({
      currentTarget: { childNodes: [ {}, {}, {} ] },
      target: wrapper.element,
    });
    expect(selectedItem).toEqual(null);
  });

  it('startDrag sets dragging to true and computes the dragAnchorPoint when a valid item on mousedown', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
    });
    const item = wrapper.find('.item').element;
    const model = wrapper.vm as any;
    const event = {
      button: MouseButton.LEFT,
      currentTarget: { childNodes: [item] },
      target: item,
      pageX: 15,
      pageY: 15,
      // tslint:disable-next-line
      preventDefault: jest.fn(),
    };
    model.startDrag(event);
    expect(model.dragging).toBe(true);
    expect(model.dragAnchorPoint).toEqual({ x: 4, y: 4 });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('startDrag does not prevent event default when item is not valid', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
    });
    const model = wrapper.vm as any;
    const event = {
      button: MouseButton.LEFT,
      currentTarget: { childNodes: [] },
      target: wrapper.element,
      pageX: 15,
      pageY: 15,
      // tslint:disable-next-line
      preventDefault: jest.fn(),
    };
    model.startDrag(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('stopDrag will make a request to server when there is selectedItem', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: mockItems[0],
    });
    const model = wrapper.vm as any;
    model.stopDrag();
    expect(model.dragging).toBe(false);
    expect(mockServices.itemService.updateItem).toHaveBeenCalled();
    expect(mockServices.itemService.updateItem.mock.calls[0])
      .toEqual([0, mockItems[0]]);
  });

  it('stopDrag will not make a request to server when no selectedItem', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
    });
    const model = wrapper.vm as any;
    model.stopDrag();
    expect(model.dragging).toBe(false);
    expect(mockServices.itemService.updateItem).not.toHaveBeenCalled();
  });

  it('doDrag updates selected item position', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: mockItems[0],
      dragging: true,
    });
    const model = wrapper.vm as any;
    const event = {
      pageX: 50,
      pageY: 50,
      // tslint:disable-next-line
      preventDefault: jest.fn(),
    };
    model.doDrag(event);
    expect(model.selectedItem.x).toBe(50);
    expect(model.selectedItem.y).toBe(50);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('doDrag will not prevent event default when no item is being moved', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
      dragging: false,
    });
    const model = wrapper.vm as any;
    const event = {
      pageX: 50,
      pageY: 50,
      // tslint:disable-next-line
      preventDefault: jest.fn(),
    };
    model.doDrag(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
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
    expect(model.validatePosition(item, { x: 1000, y: 1000})).toEqual({  x: 548, y: 548 });
    expect(model.validatePosition(item, { x: -10, y: -10})).toEqual({ x: 0, y: 0 });
    expect(model.validatePosition(item, { x: 590, y: 0})).toEqual({ x: 548, y: 0 });
    expect(model.validatePosition(item, { x: 590, y: 590})).toEqual({ x: 548, y: 548 });
    expect(model.validatePosition(item, { x: -10, y: 590})).toEqual({ x: 0, y: 548 });
    expect(model.validatePosition(item, { x: 50, y: 50})).toEqual({ x: 50, y: 50 });
  });

  it('deletes the selected item', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: mockItems[0],
    });
    const model = wrapper.vm as any;
    model.deleteItem();
    expect(model.selectedItem).toBe(null);
    expect(model.items).toHaveLength(3);
    expect(model.items.indexOf(mockItems[0])).toBe(-1);
    expect(model.items.indexOf(mockItems[1])).toBe(0);
    expect(mockServices.itemService.deleteItem).toHaveBeenCalledWith(0);
  });

  it('does not deletes anything when no selectedItem', () => {
    const wrapper = shallowMount(Canvas, { stubs });
    wrapper.setData({
      items: mockItems,
      selectedItem: null,
    });
    const model = wrapper.vm as any;
    model.deleteItem();
    expect(model.items).toEqual(mockItems);
  });
});
