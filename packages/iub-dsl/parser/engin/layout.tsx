import React from 'react';
import { LayoutContentElement } from '@iub-dsl/core';
import { ElementAST } from '@iub-dsl/core/types/layout-content/element';

import componentParser from "./component-parser";
import { ParserContextGroup } from '../types';

interface WrapperContext {
  id: ElementAST['id'],
  idx: number
}

export interface LayoutParserWrapper {
  containerWrapper?: (child: React.ReactChild, WrapperContext) => React.ReactChild
  componentWrapper?: (child: React.ReactChild, WrapperContext) => React.ReactChild
}

export interface LayoutParserParams extends LayoutParserWrapper {
  layoutNode: LayoutContentElement[];
}

/**
 * TODO: 完善布局
 */
const containerLayoutParser = (layoutInfo): React.CSSProperties => {
  return {
    display: 'flex'
  };
};

/**
 * 布局渲染器
 *
 * TODO: 结果缓存，优化性能
 *
 * parserContext 将传入每一个 parser
 */
const renderLayout = (
  layoutNode: LayoutContentElement[],
  wrapper: LayoutParserWrapper,
  parserContext: ParserContextGroup
) => {
  return Array.isArray(layoutNode) && layoutNode.map((node, idx) => {
    switch (node.type) {
      case 'container':
        const { layout, id } = node;
        const { containerWrapper, componentWrapper } = wrapper;
        const childOfContainer = (
          <div
            style={containerLayoutParser(layout)}
            className="container"
            key={id + idx}
          >
            {
              renderLayout(node.body, wrapper, parserContext)
            }
          </div>
        );

        return typeof containerWrapper === 'function'
          ? containerWrapper(childOfContainer, { id, idx })
          : childOfContainer;
      case 'componentRef':
        const componentConfig = parserContext.bindComponent(node.componentID);
        const childOfComponent = (
          <div className="component" key={componentConfig?.id + idx || 'none'}>
            {componentParser(componentConfig, parserContext)}
          </div>
        );
        return typeof componentWrapper === 'function'
          ? componentWrapper(childOfComponent, { id, idx })
          : childOfComponent;
    }
  });
};

const LayoutParser = (
  layoutParams: LayoutParserParams,
  parserContext: ParserContextGroup
) => {
  const {
    layoutNode,
    containerWrapper,
    componentWrapper,
  } = layoutParams;
  return (
    <div>
      {
        renderLayout(layoutNode, {
          containerWrapper,
          componentWrapper,
        }, parserContext)
      }
    </div>
  );
};

export default LayoutParser;
