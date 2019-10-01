import axios from 'axios';
import { Observable } from 'rxjs';
import { IItem } from '@/types/interfaces';

const imageService = (() => {
  let imageSubscriber: any;
  const observable$ = Observable.create((subscriber: any) => {
    imageSubscriber = subscriber;
    axios.get('http://localhost:8000/images')
      .then((response) => {
        const images = response.data;
        images.forEach((image: string) => subscriber.next(image));
      })
      .catch((error) => {
        subscriber.error(error);
      });
  });
  const uploadImage = (image: Blob) => {
    const form = new FormData();
    form.append('upload', image);

    axios.post(
      'http://localhost:8000/uploads',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    ).then((response) => {
      imageSubscriber.next(response.data.file);
    });
  };
  return {
    subscribe: observable$.subscribe.bind(observable$),
    unsubscribe: () => {
      // According to rxjs documentation, unsubscribe method exists, but here it appears not to
    },
    uploadImage,
  };
})();

const itemService = (() => {
  let itemSubscriber: any;
  const observable$ = Observable.create((subscriber: any) => {
    itemSubscriber = subscriber;
    axios.get('http://localhost:8000/items')
      .then((response) => {
        const items = response.data;
        items.forEach((item: string) => subscriber.next(item));
      })
      .catch((error) => {
        subscriber.error(error);
      });
  });
  const addItem = (type: string, value: string) => {
    const model = type === 'IMAGE' ? { url: value } : { text: value };
    const size = type === 'IMAGE' ? { w: 200, h: 200 } : { w: 200, h: 100 };
    const item = {
      x: 200,
      y: 200,
      w: size.w,
      h: size.h,
      type,
      model,
    };
    itemSubscriber.next(item);
    axios.post('http://localhost:8000/item', item);
  };
  const updateItem = (index: number, item: IItem) => {
    console.log({ index, item });
    axios.put('http://localhost:8000/item', { index, item });
  }
  return {
    subscribe: observable$.subscribe.bind(observable$),
    unsubscribe: () => {
      // According to rxjs documentation, unsubscribe method exists, but here it appears not to
    },
    addItem,
    updateItem,
  };
})();

export { imageService, itemService };
