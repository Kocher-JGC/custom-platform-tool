import React from 'react';
import classnames from 'classnames';
import { WidgetRendererProps } from '@engine/visual-editor/spec';
import { getWidget } from '@platform-widget-access/loader';
import { Unexpect } from './Unexpect';
// import ContainerWrapperCom from './ContainerWrapperCom';

export interface PDWidgetRendererProps extends WidgetRendererProps {
  className?
}

/**
 * 根据 widget entity 解析的组件渲染器
 */
export const WidgetRenderer: React.FC<PDWidgetRendererProps> = (props) => {
  const {
    onClick,
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

  if (WidgetFormRemote.unexpected) {
    // 处理异常组件
    Com = <Unexpect />;
  } else {
    Com = WidgetFormRemote.render(Object.assign({}, entityState, { children }));
  }
  const classes = classnames(
    "comp-renderer",
    className
  );
  return (
    <div
      {...otherProps}
      onClick={onClick}
      className={classes}
    >
      {Com}
      {/* <div className="__mark"></div> */}
    </div>
  );
};
