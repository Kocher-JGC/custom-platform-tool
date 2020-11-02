import React from 'react';
import classnames from 'classnames';
import { WidgetRendererProps } from '@engine/visual-editor/spec';
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
    entityState = {},
    layoutNodeItem,
    className,
    nestingInfo,
    platformWidgetMeta,
    ...otherProps
  } = props;
  const { widgetRef } = entity;

  let Com = <div></div>;
  if (!widgetRef) return Com;

  const { type, ...restWidgetProps } = widgetRef;
  const widgetProps = Object.assign({}, restWidgetProps, entityState);

  if (platformWidgetMeta.unexpected) {
    // 处理异常组件
    Com = <Unexpect />;
  } else {
    Com = platformWidgetMeta.render(widgetProps);
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
      <div className="__mark"></div>
    </div>
  );
};
