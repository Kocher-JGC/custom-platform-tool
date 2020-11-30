import { createMockMenuData } from '@engine/ui-admin-template';

export const menuMockData = createMockMenuData([
  {
    path: '/pageA',
    title: '模块A',
    icon: 'chess-queen',
    child: [
      {
        path: '/page1/123123',
        title: '页面 11',
      },
      {
        path: '/page2',
        title: '页面 22'
      },
      {
        path: '/page3',
        title: '页面 33'
      },
      {
        path: '/page4',
        title: '页面 44'
      },
    ]
  }
]);