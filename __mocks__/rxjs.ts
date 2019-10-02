let observableCreateFnCallback = (s: any) => {};

export default {
  Observable: {
    create: (fn: () => void) => {
      observableCreateFnCallback = fn;
      return {
        subscribe: jest.fn(),
      };
    },
  },
  getObservableCreateFnCallback: () => observableCreateFnCallback,
};