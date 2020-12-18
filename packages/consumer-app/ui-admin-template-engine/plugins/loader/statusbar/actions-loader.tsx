import { DropdownWrapperProps } from '@deer-ui/core/dropdown-wrapper/dropdown-wrapper';
import { DropdownWrapper, Icon, PureIcon } from '@engine/ui-admin-template/ui-refs';
import React from 'react';


export interface StatusbarConfigItem {
  title: string;
  icon?: string;
  pureIcon?: string;
  overlay: DropdownWrapperProps["overlay"];
  action: () => void;
  photo?: string;
  className?: string;
}

interface DisplayDOMProps {
  onClick?;
  pureIcon?;
  icon?;
  title?;
  className?;
  children?;
  photo?:string;
}

const DisplayDOM = ({
  onClick,
  pureIcon,
  icon,
  title,
  className = 'item',
  children,
  photo
}: DisplayDOMProps) => {
  const I = pureIcon ? <PureIcon n={pureIcon} /> : <Icon n={icon} />;
  return (<span onClick={onClick} className={className}>
    {I}
    {
      title && <span className="ml5">{title}</span>
    }
    {
      photo && <img src={photo} style={{width:"100%",height:"100%"}}/>
    }
    {children}
  </span>)

};

export interface StatusbarActionsLoaderProps {
  statusbarActions: StatusbarConfigItem[];
}

export const StatusbarActionsLoader: React.FC<StatusbarActionsLoaderProps> = (
  props
) => {
  const { statusbarActions, ...otherProps } = props;
  return (
    <div className="status-container">
      {
        statusbarActions.map((item) => {
          const {
            title, icon, pureIcon, overlay, action,photo,className
          } = item;
          let con;
          switch (true) {
            case typeof overlay === 'function':
              con = (
                <DropdownWrapper
                  position="right"
                  overlay={(options) => overlay({
                    ...otherProps,
                    ...options,
                  })}
                >
                  <DisplayDOM
                    onClick={action}
                    title={title}
                    icon={icon}
                    pureIcon={pureIcon}
                    photo={photo}
                    className={className}
                  />
                </DropdownWrapper>
              );
              break;
            case !!action:
              con = (
                <DisplayDOM
                  onClick={action}
                  title={title}
                  icon={icon}
                  pureIcon={pureIcon}
                  photo={photo}
                  className={className}
                />
            );
            break;
        }
        return <React.Fragment key={`${icon}_${title}`}>{con}</React.Fragment>;
      })}
    </div>
  );
};
