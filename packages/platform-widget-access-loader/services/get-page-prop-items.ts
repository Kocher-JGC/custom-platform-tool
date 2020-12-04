import { ApiMock } from "./api-mock";

/**
 * TODO: 搞清楚属性如何影响组件实例，或者是说组件实例如何根据属性数据进行调整
 */
export const pagePropItems: PropItemCompAccessSpec[] = [
  (entity) => {
    return {
      id: 'PropLabelColor',
      label: '背景颜色',
      target: 'backgroundColor',
      component: {
        type: 'Input'
      }
    };
  },
];

export const getPagePropItems = ApiMock(pagePropItems);
