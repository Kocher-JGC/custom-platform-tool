import React, { useState, useEffect } from "react";
import {
  BankOutlined, PieChartOutlined, GithubOutlined, PlusOutlined, MoreOutlined
} from "@ant-design/icons";
import { Link } from "multiple-page-routing";
import { DropdownWrapper } from "@deer-ui/core/dropdown-wrapper";
import { Menus } from "@deer-ui/core/menu";
import { GetApplication, DelApplication } from "@provider-app/services";
import { ShowModal } from "@infra/ui";
import { CreateApp } from "./CreateApp";

import './dashboard.scss';

const defaultToRoute = '/page-manager';

const iconGroupTemp = [
  <GithubOutlined />,
  <BankOutlined />,
  <PieChartOutlined />,
];

interface AppTileProps {
  icon
  title
  onClick?
  params?
  to?
  moreOptions?
}

const AppTile = ({
  icon,
  title,
  onClick,
  params,
  to,
  moreOptions,
}: AppTileProps) => {
  return (
    <div
      className="p-2 app-tile"
      style={{
        flexBasis: '25%'
      }}
    >
      <Link
        to={to}
        onClick={onClick}
        params={params}
        className="text-gray-700 text-center block py-6 bg-white shadow-md cursor-pointer"
      >
        <div className="app-icon text-6xl" style={{ height: 90 }}>
          {icon}
          {/* {Icon()} */}
        </div>
        <div className="app-title py-2" style={{ height: 40 }}>
          {title}
        </div>
      </Link>
      {
        moreOptions && (
          <DropdownWrapper
            className="more-options"
            overlay={(e) => {
              return (
                <Menus data={moreOptions} />
              );
            }}
          >
            <MoreOutlined className="action-btn" />
          </DropdownWrapper>
        )
      }
    </div>
  );
};

export interface DashboardProps {
  onSelectApp: (appInfo: {
    app: string
    appName: string
  }) => void
  didMount?: () => void
}

/**
 * 入口大厅
 *
 * 导航时需要注意：
 *
 * 1. 设置默认的路由为 app
 */
export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { didMount, onSelectApp } = props;
  const [appData, setAppData] = useState([]);

  const updateAppList = () => {
    GetApplication().then((appResData) => {
      setAppData(appResData.result);
    });
  };

  useEffect(() => {
    didMount && didMount();
    updateAppList();
  }, []);

  return (
    <div className="container mx-auto mt20 dashboard">
      <div className="text-3xl px-2 py-10 font-bold">我的应用</div>
      <div className="flex flex-wrap">
        {
          appData && appData.map(((data, idx) => {
            const {
              appShortNameEn, id, appCode, accessName
            } = data;
            return (
              <AppTile
                key={id}
                icon={iconGroupTemp[idx % iconGroupTemp.length]}
                title={appShortNameEn}
                onClick={(e) => {
                  onSelectApp && onSelectApp({
                    app: accessName,
                    appName: appShortNameEn
                  });
                }}
                to={defaultToRoute}
                params={{
                  app: accessName
                }}
                moreOptions={[
                  {
                    text: '删除应用',
                    action: () => {
                      ShowModal({
                        type: 'confirm',
                        confirmText: `确定删除 ${appShortNameEn} 吗?`,
                        children: () => {
                          return (
                            <div>确定删除</div>
                          );
                        },
                        onConfirm: (isSure) => {
                          if (!isSure) return;
                          DelApplication(id).then(() => {
                            updateAppList();
                          });
                        }
                      });
                    }
                  },
                  {
                    text: '发布应用',
                    action: () => {
                      console.log('object :>> ', 'object');
                    }
                  }
                ]}
              />
            );
          }))
        }
        <AppTile
          // to="/page-manager"
          icon={<PlusOutlined />}
          onClick={(e) => {
            ShowModal({
              title: '添加应用',
              children: ({ close }) => {
                return (
                  <CreateApp
                    onSuccess={(e) => {
                      close();
                      updateAppList();
                    }}
                  />
                );
              }
            });
          }}
          title="添加应用"
        />
      </div>
    </div>
  );
};
