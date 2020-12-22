import React from "react";
import classnames from "classnames";
import { WidgetRendererProps } from "@engine/visual-editor/spec";
import { getWidget } from "@platform-widget-access/loader";
import { Unexpect } from "./Unexpect";
// import ContainerWrapperCom from './ContainerWrapperCom';

export interface PDWidgetRendererProps extends WidgetRendererProps {
  className?;
}

const widgetActions = {
  onChange: () => {},
  onClick: () => {},
};

const devEnv = process.env.NODE_ENV === "development";

const DevEnvInfo = ({ id, nestingInfo }) => {
  const tipID = `__tip_${id}`;
  React.useEffect(() => {
    if (!devEnv || !window.tippy) return;
    window.tippy(`#${tipID}`, {
      content: `调试信息：id: ${id}, nestingInfo: ${JSON.stringify(
        nestingInfo
      )}`,
    });
  }, []);
  return devEnv ? (
    <div className="__dev_env_info" id={tipID}>
      {/* 调试信息：id: {id}, nestingInfo: {JSON.stringify(nestingInfo)} */}
    </div>
  ) : null;
};

/**
 * 根据 widget entity 解析的组件渲染器
 */
export const WidgetRenderer: React.FC<PDWidgetRendererProps> = (props) => {
  const {
    onClick,
    id,
    entity,
    children,
    entityState = {},
    layoutNodeItem,
    className,
    nestingInfo,
    ...otherProps
  } = props;
  const { widgetRef } = entity;

  // 从远端获取组件
  const WidgetFormRemote = getWidget(widgetRef);

  if (!widgetRef) return null;

  let Com;

  if (!WidgetFormRemote) {
    // 处理异常组件
    Com = <Unexpect />;
  } else {
    Com = WidgetFormRemote.render(
      Object.assign({}, entityState, { children }),
      widgetActions
    );
  }
  const classes = classnames("comp-renderer", className);
  return (
    <div {...otherProps} id={id} onClick={onClick} className={classes}>
      {Com}
      {/* <div className="__mark"></div> */}
      <DevEnvInfo id={id} nestingInfo={nestingInfo} />
    </div>
  );
};
