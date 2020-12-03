module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'index'
      // 工程总览: [
      //   'concept/index', 
      // ],
      // 系统设计: [
      //   '系统设计/架构设计v3'
      // ],
      // 方案设计: [
      //   '方案设计/UI组件接入标准',
      //   '方案设计/应用平台前端运行规则与方案',
      //   '方案设计/权限控制详细设计',
      //   '方案设计/路由详细设计',
      //   '方案设计/页面设计器方案设计',
      // ],
      // 工程部署: [
      //   '工程部署/deployment',
      //   '工程部署/前端CD总结',
      //   '工程部署/应用部署说明',
      //   '工程部署/部署说明',
      // ],
    },
    {
      type: 'category',
      label: 'Docusaurus',
      items: [
        '工程部署/前端部署说明', 
      ],
    },
  ],
  'pages-api': [
    {

    }
  ],
  'access': [
    {
      type: 'category',
      label: 'Themes',
      items: [
        'access/index',
      ],
    }
  ],
  // 'pages-access': {
  //   平台接入: [
  //     'pages-access/平台接入/write-sub-app',
  //     'pages-access/平台接入/平台组件接入规则',
  //   ],
  // }
};
