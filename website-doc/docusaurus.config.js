module.exports = {
  title: '自定义工具 3.0 前端工程文档',
  tagline: '万物皆可自定义',
  url: 'https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend',
  baseUrl: '/',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'haoyun tech', // Usually your GitHub org/user name.
  projectName: '自定义工具 3.0 前端工程', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: '自定义工具 3.0 前端',
      logo: {
        alt: '3.0',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/introduction',
          // docId: 'introduction',
          // activeBasePath: 'docs',
          label: '介绍',
          position: 'left',
        },
        { 
          to: 'docs/api', 
          label: 'API', 
          position: 'left' 
        },
        { 
          to: 'docs/architecture', 
          label: '设计', 
          position: 'left' 
        },
        { 
          to: 'docs/configuration', 
          label: '配置', 
          position: 'left' 
        },
        { 
          to: 'docs/access_platform_widget', 
          label: '接入', 
          position: 'left' 
        },
        { 
          to: 'docs/deployment', 
          label: '部署', 
          position: 'left' 
        },
        { 
          to: 'blog', 
          label: 'Blog', 
          position: 'right' 
        },
        {
          href: 'https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend',
          label: 'Git',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: '工程文档',
              to: 'docs/',
            },
            // {
            //   label: 'Second Doc',
            //   to: 'docs/doc2/',
            // },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            // {
            //   label: 'Twitter',
            //   href: 'https://twitter.com/docusaurus',
            // },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Haoyun tech, Inc. Built with 自定义 3.0 前端团队.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // editUrl:
          //   'https://10.0.4.55/custom-platform-v3-frontend-group/custom-platform-v3-frontend',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
