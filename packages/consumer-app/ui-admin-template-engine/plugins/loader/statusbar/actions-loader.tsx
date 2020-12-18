import React from "react";

import {
  Icon,
  PureIcon,
  DropdownWrapper,
} from "@engine/ui-admin-template/ui-refs";
import { DropdownWrapperProps } from "@deer-ui/core/dropdown-wrapper/dropdown-wrapper";

export interface StatusbarConfigItem {
  title: string;
  icon?: string;
  pureIcon?: string;
  overlay: DropdownWrapperProps["overlay"];
  action: () => void;
}

interface DisplayDOMProps {
  onClick?;
  pureIcon?;
  icon?;
  title?;
  className?;
  children?;
}

const DisplayDOM = ({
  onClick,
  pureIcon,
  icon,
  title,
  className = "item",
  children,
}: DisplayDOMProps) => {
  const I = pureIcon ? <PureIcon n={pureIcon} /> : <Icon n={icon} />;
  return (
    <span onClick={onClick} className={className}>
      {I}
      {title && <span className="ml5">{title}</span>}
      {children}
    </span>
  );
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
      {statusbarActions.map((item) => {
        const { title, icon, pureIcon, overlay, action } = item;
        let con;
        switch (true) {
          case typeof overlay === "function":
            con = (
              <DropdownWrapper
                position="right"
                overlay={(options) =>
                  overlay({
                    ...otherProps,
                    ...options,
                  })
                }
              >
                <DisplayDOM
                  onClick={action}
                  title={title}
                  icon={icon}
                  pureIcon={pureIcon}
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
              />
            );
            break;
        }
        return <React.Fragment key={`${icon}_${title}`}>{con}</React.Fragment>;
      })}
    </div>
  );
};
