import React, { FC } from 'react';
import { Call, IsFunc } from '@mini-code/base-func';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Children } from '@deer-ui/core/utils';

export interface LoginSelectorProps {
  isLogin: boolean;
  autoLoging: boolean;
  children: Children;
  loginPanelRender: () => JSX.Element
  didMount?: () => void;
}

export const AuthSelector: FC<LoginSelectorProps> = (props) => {
  const { didMount, children, loginPanelRender, isLogin, autoLoging } = props;

  React.useEffect(() => {
    didMount?.();
  }, []);

  if(!loginPanelRender) {
    return (
      <div>请传入 loginPanelRender</div>
    );
  }

  let container;
  switch (true) {
    case isLogin:
      container = IsFunc(children) ? children(props) : children;
      break;
    case autoLoging:
      container = (
        <div id="auto-logging-tip">自动登录中...</div>
      );
      break;
    default:
      container = loginPanelRender(props);
  }
  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={isLogin ? 'LOGIN_SUCCESS' : 'NO_LOGIN_YET'}
        classNames="fade"
        timeout={200}
      >
        {container}
      </CSSTransition>
    </TransitionGroup>
  );
};
