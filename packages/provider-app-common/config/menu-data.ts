export interface MenuDataType {
  /** 菜单名 */
  title: string
  /** icon */
  icon: string
  /** 菜单 id，用于 react 的 key */
  id: string
  /** 导航将要到达的 path */
  path?: string
  /** children，如果有，则认为点击没有跳转功能 */
  children?: MenuDataType[]
}

export const ProviderAppMenuData: MenuDataType[] = [
  {
    title: '页面设计',
    icon: '',
    id: '1',
    // path: '/menu-manager',
    children: [
      {
        title: '页面管理',
        id: '12',
        icon: '',
        path: '/page-manager'
      },
      {
        title: '弹窗选择',
        id: '13',
        icon: '',
        path: '/popup-window-selector'
      },
    ]
  },
  {
    // path: '/menu-manager',
    icon: '',
    title: '数据设计',
    id: '2',
    children: [
      {
        title: '表结构管理',
        id: '21',
        icon: '',
        path: '/TableStruct'
      },
      {
        title: '字典管理',
        id: '22',
        icon: '',
        path: '/dictionary-manager'
      },
      {
        title: '其他数据源',
        id: '23',
        icon: '',
        children: [
          {
            title: '其他数据源',
            id: '23',
            icon: '',
            // path: '/page-manager',
          }
        ]
      },
    ]
  },
  {
    title: '系统管理',
    icon: '',
    id: '3213123',
    // path: '/menu-manager',
    children: [
      {
        title: '菜单管理',
        id: '1415rwqtqr',
        icon: '',
        path: '/menu-manager'
      },
      {
        title: '权限管理',
        id: '123qwe',
        icon: '',
        children: [
          {
            title: '权限项管理',
            id: '1416rwqtqr',
            icon: '',
            path: '/lessee-authority'
          },
          {
            title: '权限树管理',
            id: '123qweasd',
            icon: '',
            path: '/auth-distributor'
          }
        ]
      }
    ]
  },
];
