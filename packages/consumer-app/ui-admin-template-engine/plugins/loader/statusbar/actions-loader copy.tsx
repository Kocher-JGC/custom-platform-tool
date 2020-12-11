import React from 'react';

import { Icon, PureIcon, DropdownWrapper } from '@engine/ui-admin-template/ui-refs';
import { DropdownWrapperProps } from '@deer-ui/core/dropdown-wrapper/dropdown-wrapper';

interface StatusbarConfigItemBase {
  title: string
  icon?: string
  pureIcon?: string
}

interface StatusbarConfigItemOverlay extends StatusbarConfigItemBase {
  type: 'overlay'
  overlay: DropdownWrapperProps['overlay']
  hitItem: () => void
}

interface StatusbarConfigItemAction extends StatusbarConfigItemBase {
  type: 'action'
  action: () => void
}

export type StatusbarConfigItem = StatusbarConfigItemAction | StatusbarConfigItemOverlay

interface DisplayDOMProps {
  onClick?
  pureIcon?
  icon?
  title?
  className?
  children?
}

const DisplayDOM = ({
  onClick,
  pureIcon,
  icon,
  title,
  className = 'item',
  children
}: DisplayDOMProps) => {
  const I = pureIcon ? <PureIcon n={pureIcon} /> : <Icon n={icon} />;
  return (
    <span onClick={onClick} className={className}>
      {I}
      {
        title && <span className="ml5">{title}</span>
      }
      {children}
    </span>
  );
};


export interface StatusbarActionsLoaderProps {
  statusbarActions: StatusbarConfigItem[];
}

export const StatusbarActionsLoader: React.FC<StatusbarActionsLoaderProps> = (props) => {
  const { statusbarActions, ...otherProps } = props;
  return (
    <div className="status-container">
      {
        statusbarActions.map((item) => {
          const {
            title, icon, pureIcon, type
          } = item;
          let con;
          switch (type) {
            case 'overlay':
              con = (
                <DropdownWrapper
                  position="right"
                  overlay={(options) => item.overlay({
                    ...otherProps,
                    ...options,
                  })}
                >
                  <DisplayDOM
                    onClick={item.hitItem}
                    title={title}
                    icon={icon}
                    pureIcon={pureIcon}
                  />
                </DropdownWrapper>
              );
              break;
            case 'action':
              con = (
                <DisplayDOM
                  onClick={item.action}
                  title={title}
                  icon={icon}
                  pureIcon={pureIcon}
                />
              );
              break;
          }
          return (
            <React.Fragment key={`${icon}_${title}`}>
              {con}
            </React.Fragment>
          );
        })
      }
    </div>
  );
};
