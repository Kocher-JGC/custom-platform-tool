import React from "react";
import { Link, onNavigate } from "multiple-page-routing";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;

interface DataItem {
  children?: DataItem[];
  title: string;
  path: string;
  id: string;
  icon: string;
}

interface TreeProps {
  level: number;
  treeData?: DataItem[];
  mode?;
  onItemClick: (item) => void;
}

const MenuTree: React.FC<TreeProps> = (props) => {
  const { level, treeData, onItemClick, ...other } = props;

  return (
    <>
      {treeData &&
        treeData.map((item) => {
          const { title, icon, id, children, path } = item;
          const hasChild = Array.isArray(children) && children.length > 0;
          const levelId = id;
          return hasChild ? (
            <SubMenu icon={icon} title={title} key={id} {...other}>
              {(() => {
                const res = (
                  <MenuTree
                    treeData={children}
                    onItemClick={onItemClick}
                    mode="vertical"
                    level={level + 1}
                  />
                );
                return res;
              })()}
            </SubMenu>
          ) : (
            <Menu.Item
              key={id}
              {...other}
              onClick={(e) => {
                onItemClick(item);
              }}
            >
              {title}
            </Menu.Item>
          );
        })}
    </>
  );
};

export const Nav = (props) => {
  const { navConfig } = props;
  return (
    <div className="app-nav">
      <Menu mode="inline">
        <MenuTree
          treeData={navConfig}
          onItemClick={(item) => {
            const { title, path } = item;
            onNavigate({
              type: "PUSH",
              path,
              params: {
                title,
              },
            });
          }}
          level={0}
        />
      </Menu>
    </div>
  );
};
