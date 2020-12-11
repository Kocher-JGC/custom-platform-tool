export interface WidgetParseRes {
  widgetId: string;
  widgetCode: string;
  widgetRenderMeta: {
    render: (widgetProp: any, eventProp: any) => JSX.Element;
    [str: string]: any;
  };
  dynamicProps: any;
  staticProps: any;
  eventHandlers: any;
}