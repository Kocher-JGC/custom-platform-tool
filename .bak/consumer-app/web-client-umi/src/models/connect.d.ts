import { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { IGlobalModelState } from './global';
import { IUserModelState } from './user';
import { ILoginModelState } from './login';
import { IMenusModelState } from './menu';
import { ITabsModelState } from './tabs';
import { IAppModelState } from './app';

export { IGlobalModelState, IUserModelState };

export interface ILoading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    tabs? : boolean;
    app? : boolean;
  };
}

export interface ConnectState {
  global: IGlobalModelState;
  loading: ILoading;
  settings: ProSettings;
  user: IUserModelState;
  login: ILoginModelState;
  menus: IMenusModelState;

  tabs: ITabsModelState;
  app: IAppModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
