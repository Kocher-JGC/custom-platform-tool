import React from 'react';
import { SearchBox,  SearchBoxProps } from '@engine/ui-admin-template/components';
import { Icon } from '@engine/ui-admin-template/ui-refs';
import { loadPlugin } from '@engine/ui-admin-template/utils/load-plugin';
import { StatusbarActionsLoader, StatusbarConfigItem } from './actions-loader';

export interface StatusbarLoaderProps {
  /** 导航栏的配置 */
  onToggleNav: SearchBoxProps['onToggleNav']
  menuCodeMapper: {}
  StatusbarPlugin?: () => JSX.Element
  showNavMenu: boolean
  appTitle?: string
  statusbarActions: StatusbarConfigItem[]
}

export interface StatusbarRenderCtx {

}

export const StatusbarLoader: React.FC<StatusbarLoaderProps> = (props) => {
  const {
    statusbarActions, StatusbarPlugin, appTitle,
    menuCodeMapper, onToggleNav, showNavMenu
  } = props;
  const renderCtx = {};
  return (
    <div className="admin-status-bar" id="statusBar">
      <div className="action-group">
        <Icon
          n={showNavMenu ? "bars" : "align-left"}
          onClick={() => onToggleNav?.()}
          classNames={['_action-btn']}
        />
      </div>
      <SearchBox
        codeMapper={menuCodeMapper}
      />
      <div className="title">
        {appTitle}
      </div>
      <span className="flex" />
      <StatusbarActionsLoader statusbarActions={statusbarActions} />
      {
        StatusbarPlugin && loadPlugin(StatusbarPlugin, renderCtx)
      }
    </div>
  );
};
