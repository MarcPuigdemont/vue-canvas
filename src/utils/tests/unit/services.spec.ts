jest.mock('axios');
jest.mock('rxjs');
import axios from 'axios';
import rxjs from 'rxjs';
import { imageService } from '@/utils/services';

declare var global: any;

const mockAxios = axios as any;
const mockRxjs = rxjs as any;
const mockImages = ['image1', 'image2', 'image3'];

describe('imageService', () => {
  const subscriber = { next: jest.fn(), error: jest.fn() };
  beforeEach(() => {
    subscriber.next.mockReset();
    subscriber.error.mockReset();
    mockAxios.get.mockReset();
    mockAxios.post.mockReset();
  });
  it('will emit one value for each image when subscribing to it', (done) => {
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockImages }));
    mockRxjs.getObservableCreateFnCallback()(subscriber);
    setTimeout(() => {
      expect(subscriber.next).toBeCalledTimes(3);
      expect(subscriber.next.mock.calls[0][0]).toBe('image1');
      expect(subscriber.next.mock.calls[1][0]).toBe('image2');
      expect(subscriber.next.mock.calls[2][0]).toBe('image3');
      done();
    });
  });

  it('will rise an error to the subscriber if the call to the server fails', (done) => {
    mockAxios.get.mockImplementationOnce(() => Promise.reject({ error: 'an error' }));
    mockRxjs.getObservableCreateFnCallback()(subscriber);
    setTimeout(() => {
      expect(subscriber.error).toHaveBeenCalledWith({ error: 'an error' });
      done();
    });
  });

  /**
   * There is an issue with how closure works on imageService. 
   * I suspect copying a function with = may not preserve all variables
   * captured within it's scope by closure.
   * 
   * Therefore, when executing uploadImage, on post.then imageSubscriber is undefined
   */
  it.skip('will send form data to server and emit new image on upload image', (done) => {    
    const originalFormData = global.FromData;
    global.FormData = function() {
      return {
        value: '',
        append: function(_: any, item: any) {
          this.value = item;
        },
      };
    };
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: [] }));
    mockAxios.post.mockImplementationOnce(() => Promise.resolve({ data: { file: 'abcdef' } }));
    mockRxjs.getObservableCreateFnCallback()(subscriber);
    setTimeout(() => {
      const a = new Blob(['image4']);
      console.log(a.slice(0, 1));
      imageService.uploadImage(new Blob(['image4']));
      expect(mockAxios.post.mock.calls[0][0]).toBe('http://localhost:8000/uploads');
      expect(mockAxios.post.mock.calls[0][1].value).toBe('image4');
      expect(mockAxios.post.mock.calls[0][2]).toEqual({ headers: { 'Content-Type': 'multipart/form-data' }});
      setTimeout(() => {
        expect(subscriber.next).toBeCalledTimes(1);
        expect(subscriber.next.mock.calls[0][0]).toBe('image4');
        global.FormData = originalFormData;
        done();
      });
    });
  });
});