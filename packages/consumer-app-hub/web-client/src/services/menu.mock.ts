import { createMockMenuData } from '@engine/ui-admin-template';

export const menuMockData = createMockMenuData([
  {
    code: 'pageA',
    title: '模块A',
    icon: 'chess-queen',
    child: [
      {
        code: 'page1',
        title: '页面 11'
      },
      {
        code: 'page2',
        title: '页面 22'
      },
      {
        code: 'page3',
        title: '页面 33'
      },
      {
        code: 'page4',
        title: '页面 44'
      },
    ]
  }
]);