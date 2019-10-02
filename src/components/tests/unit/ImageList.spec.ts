import { mount, shallowMount } from '@vue/test-utils';
jest.mock('@/utils/services');
import * as services from '@/utils/services';
import ImageList from '@/components/ImageList.vue';

declare var global: any;

const mockServices = services as any;
const mockImages = ['image1', 'image2', 'image3'];
describe('ImageList Component', () => {
  it('gets the images from the server', () => {
    const wrapper = mount(ImageList);
    const imageServiceSubscriber = mockServices.imageService.getImageServiceSubscriber();
    expect(imageServiceSubscriber).toBeDefined();
    mockImages.forEach((image) => imageServiceSubscriber.next(image));
    const model = wrapper.vm as any;
    expect(model.images).toEqual(mockImages);
  });

  it('logs an error if it fails to get the images from the server', () => {
    const originalMethod = global.console.error;
    global.console.error = jest.fn();
    mount(ImageList);
    const imageServiceSubscriber = mockServices.imageService.getImageServiceSubscriber();
    expect(imageServiceSubscriber).toBeDefined();
    imageServiceSubscriber.error('an error occurred');
    const spy = jest.spyOn(global.console, 'error');
    expect(spy).toHaveBeenCalledWith('Error getting next image', 'an error occurred');
    global.console.error = originalMethod;
  });

  it('unsubscribes on unmount', () => {
    const wrapper = mount(ImageList);
    wrapper.destroy();
    expect(mockServices.imageService.unsubscribe).toHaveBeenCalled();
  });

  it('adds an image to the canvas when clicking an image element', () => {
    const wrapper = shallowMount(ImageList);
    wrapper.setData({
      images: mockImages,
    });
    wrapper.findAll('li').at(1).trigger('click');
    expect(mockServices.itemService.addItem).toBeCalledWith('IMAGE', mockImages[1]);
  });
});
