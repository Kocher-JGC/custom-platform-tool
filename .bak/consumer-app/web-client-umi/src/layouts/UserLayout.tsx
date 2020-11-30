import { Redirect, connect } from "umi";

import { Helmet, HelmetProvider } from "react-helmet-async";
import React from "react";
import styles from "./UserLayout.less";
import { ConnectState } from "@/models/connect";
import { IAppModelState } from "@/models/app";

export interface IUserLayoutProps {
  app?: IAppModelState;
  children: React.ReactNode;
}

class UserLayout extends React.PureComponent<IUserLayoutProps> {
  render() {
    const {
      app,
      children,
      location: { pathname }
    } = this.props;
    if (!app?.currentApp?.applicationCode && pathname.indexOf("/user/app-list") === -1) {
      return <Redirect to="/user/app-list" />;
    }

    return (
      <HelmetProvider>
        <Helmet>
          <title>登录</title>
          <meta name="description" content="登录" />
        </Helmet>

        <div className={styles.container}>
          <div className={styles.content}>{children}</div>
        </div>
      </HelmetProvider>
    );
  }
}

// export default React.memo(UserLayout);

export default connect(({ app }: ConnectState) => ({
  app
}))(UserLayout);
