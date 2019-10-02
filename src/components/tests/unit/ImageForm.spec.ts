import { shallowMount } from '@vue/test-utils';
jest.mock('@/utils/services');
import ImageForm from '@/components/ImageForm.vue';
import * as services from '@/utils/services';

const mockServices = services as any;

describe('ImageForm Component', () => {
  beforeEach(() => {
    mockServices.imageService.uploadImage.mockReset();
  });

  it('updates the file when new file is selected', () => {
    const wrapper = shallowMount(ImageForm);
    const model = wrapper.vm as any;
    model.updateFile({ target: { files: ['image0', 'image1'] }});

    wrapper.setData({ file: null });
    expect(model.file).toBe(null);
    model.updateFile({ target: {}, dataTransfer: { files: ['image0', 'image1'] }});
    expect(model.file).toBe('image0');
  });

  it('sets the file to null if event has no files', () => {
    const wrapper = shallowMount(ImageForm);
    const model = wrapper.vm as any;
    model.updateFile({ target: {}, dataTransfer: {}});
    expect(model.file).toBe(null);
  });

  it('uploadImage calls the imageService if a file is selected', () => {
    const wrapper = shallowMount(ImageForm);
    const model = wrapper.vm as any;
    wrapper.setData({ file: 'image0' });
    model.uploadImage();
    expect(mockServices.imageService.uploadImage).toHaveBeenCalledWith('image0');
  });

  it('uploadImage should not call the imageService if no file selected', () => {
    const wrapper = shallowMount(ImageForm);
    const model = wrapper.vm as any;
    wrapper.setData({ file: null });
    model.uploadImage();
    expect(mockServices.imageService.uploadImage).not.toHaveBeenCalled();
  });
});
