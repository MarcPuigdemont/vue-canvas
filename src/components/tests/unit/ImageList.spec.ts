import { mount } from '@vue/test-utils';
import ImageList from '@/components/ImageList.vue';
import axios from 'axios';

const mockImages = ['image1', 'image2', 'image3'];
jest.mock('axios', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: mockImages })),
}));

describe('ImageList Component', () => {
  it('gets the images from the server', (done) => {
    expect(axios.get).not.toBeCalled();
    const wrapper = mount(ImageList);
    expect(axios.get).toBeCalled();
    wrapper.vm.$nextTick(() => {
      const model = wrapper.vm as any;
      expect(model.images).toBe(mockImages);
      done();
    });
  });
});
