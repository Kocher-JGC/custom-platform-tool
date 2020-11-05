export type IStatus = "success" | "info" | "warning" | "error"
export interface IOperationalMenuItem {
  operate: string;
  title: string;
  behavior: string;
}

export interface IValueEnum {
  [key: string]: React.ReactNode | {
    text: React.ReactNode;
    status?: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
  };
}

export interface ITableType {
  title: string;
  value: string;
}

export interface ISELECTSMENU {
  label: string
  key: string
  value: string
}

export interface ILesseeAuthority {
  id: string
  name: string
  code: string
}
