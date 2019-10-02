let imageServiceSubscriber: any = undefined; 
let itemServiceSubscriber: any = undefined;

const imageService = {
  subscribe: jest.fn().mockImplementation((subscriber) => {
    imageServiceSubscriber = subscriber;
  }),
  unsubscribe: jest.fn(),
  getImageServiceSubscriber: () => imageServiceSubscriber,
  uploadImage: jest.fn(),
};
const itemService = {
  subscribe: jest.fn().mockImplementation((subscriber) => {
    itemServiceSubscriber = subscriber;
  }),
  unsubscribe: jest.fn(),
  addItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
  getItemServiceSubscriber: () => itemServiceSubscriber,
};

export {
  imageService,
  itemService,
};
  