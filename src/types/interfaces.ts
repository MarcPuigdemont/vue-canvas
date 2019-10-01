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
