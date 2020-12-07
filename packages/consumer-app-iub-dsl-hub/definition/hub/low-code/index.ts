export interface Lowcode {
  code?: any;
  [str: string]: any;
}

export interface LowcodeCollection {
  [lowCodeId: string]: Lowcode;
}