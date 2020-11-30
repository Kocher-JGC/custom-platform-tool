import { AdminTmplMenus, AdminTmplMenuItem } from "@engine/ui-admin-template/types";

interface MenuDataRes {
  createdBy
  createdUserName
  deleteFlag
  gmtCreate
  gmtModified
  hasChildren
  icon
  id
  level
  modifiedBy
  modifiedUserName
  name
  pageLink
  pageName
  path
  pid
  sort
  status
  type
  version
}

interface FlatNodeItem {
  [id: string]: AdminTmplMenuItem
}

/**
 * 将远端返回的数据转换成 admin 能识别的 menu 的数据结构
 * 1. 通过原型链的方式建立 tree 关系
 */
export const remoteMenu2AppMenu = (menuDataRes: MenuDataRes[]): AdminTmplMenus => {
  // 切断原型链
  const menuDataResCopy = [...menuDataRes];
  const menuTree: AdminTmplMenus = [];
  const flatNodeItems: FlatNodeItem = {};
  menuDataResCopy.forEach((item) => {
    const { id, path, name, level, pid, icon } = item;
    const appMenuItem: AdminTmplMenuItem = {
      path: `page~${id}`,
      title: name,
      icon: icon,
      params: {
        pageID: id
      }
    };
    if(!flatNodeItems[id]) flatNodeItems[id] = appMenuItem;
    Object.assign(flatNodeItems[id], appMenuItem);
    if(pid) {
      if(!flatNodeItems[pid]) flatNodeItems[pid] = appMenuItem;
      Object.assign(flatNodeItems[pid], {
        child: []
      });
      flatNodeItems[pid].child?.push(appMenuItem);
    } else {
      menuTree.push(flatNodeItems[id]);
    }
  });
  // console.log('menuDataRes', menuDataRes);
  // console.log('menuTree', menuTree);
  return menuTree;
};