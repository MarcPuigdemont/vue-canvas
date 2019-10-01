export interface IItemModel {
  text?: string;
  url?: string;
}

export interface IItem {
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  model: IItemModel;
}

export interface IPoint {
  x: number;
  y: number;
}

export enum MouseButton {
  LEFT,
  MIDDLE,
  RIGHT,
}

/* I don't exactly know why, but MouseEvent target and currentTarget interface lacks some info */
export interface IMouseEvent {
  button: MouseButton;
  pageX: number;
  pageY: number;
  preventDefault: () => void;
  target: {
    closest: (selector: string) => any;
  };
  currentTarget: {
    childNodes: any[];
  };
  which: number;
}
