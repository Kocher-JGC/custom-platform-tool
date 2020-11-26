export const widgetRenderer = (conf) => {
  console.log(conf);
  return conf.widgetRender(conf.staticProps);

};