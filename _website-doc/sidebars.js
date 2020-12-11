module.exports = {
  docs: [
    'introduction',
  ],
  'api': [
    {

    }
  ],
  'design': [
    {
      type: 'category',
      label: '架构设计',
      items: [
        'architecture'
      ],
    },
    {
      type: 'category',
      label: '方案设计',
      items: [
        'module-design/UI组件接入标准',
        'module-design/应用平台前端运行规则与方案',
        'module-design/权限控制详细设计',
        'module-design/路由详细设计',
        'module-design/页面设计器方案设计',
        'module-design/布局系统',
      ],
    },
    {
      type: 'category',
      label: '设计模版',
      items: [
        'design-tmpl/设计模版-方案',
        'design-tmpl/设计模版-系统',
        'design-tmpl/设计模版-详细',
      ],
    },
  ],
  'access': [
    {
      type: 'category',
      label: '平台组件接入',
      items: [
        'access/平台组件接入/知识准备',
        'access/平台组件接入/接入指南',
        'access/平台组件接入/接入示例',
        'access/页面数据结构',
      ],
    },
    {
      type: 'category',
      label: '配置端接入',
      items: [
        'access/配置端接入/业务模块接入',
      ],
    },
    {
      type: 'category',
      label: '应用端接入',
      items: [
        'access/应用端接入/IUB-DSL介绍',
        'access/应用端接入/IUB-DSL接入',
      ],
    },
  ],
  'deployment': [
    // {
    //   type: 'category',
    //   label: 'deployment',
    //   items: [
    //   ],
    // }
    'deployment/deployment',
    'deployment/provider_app_deploy',
    'deployment/consumer_app_deploy',
  ],
  // 'pages-access': {
  //   平台接入: [
  //     'pages-access/平台接入/write-sub-app',
  //     'pages-access/平台接入/平台组件接入规则',
  //   ],
  // }
};
