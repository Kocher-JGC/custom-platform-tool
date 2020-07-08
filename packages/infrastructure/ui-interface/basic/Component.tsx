import React, { useEffect } from 'react';
import classNames from 'classnames';
import { BasicComponent } from './types';

type CompPropsType = BasicComponent;
type CompType = CompPropsType & React.FC & React.Component

/**
 * 基础组件的 HOC
 */
export function basicComponentFac<T>(Comp: T) {
  return <P extends CompPropsType>(props: P) => {
    const {
      onMount, onUnmount, wrapper,
      className, classnames,
      ...otherProps
    } = props;

    /**
     * 执行默认的回调
     */
    useEffect(() => {
      onMount && onMount();
      return () => {
        onUnmount && onUnmount();
      };
    }, []);

    const classes = classNames(className, classnames);

    const child = (
      <Comp
        className={classes}
        {...otherProps}
      />
    );
    return typeof wrapper === 'function'
      ? wrapper(child) : child;
  };
}
