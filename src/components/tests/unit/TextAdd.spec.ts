import { shallowMount } from '@vue/test-utils';
jest.mock('@/utils/services');
import TextAdd from '@/components/TextAdd.vue';
import * as services from '@/utils/services';

const mockServices = services as any;

describe('TextAdd Component', () => {
  it('calls item service addItem when clicked', () => {
    const wrapper = shallowMount(TextAdd);
    wrapper.find('#addText').trigger('click');
    expect(mockServices.itemService.addItem).toHaveBeenCalledWith('TEXT', 'new added text');
  });
});
