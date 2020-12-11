import { onNavigate } from 'multiple-page-routing';
import { $T } from '@deer-ui/core/utils/config';

export const loadPlugin = (Plugin, props?) => {
  if(typeof Plugin !== 'function') {
    // return console.error(`传入的插件类型不是方法，请查看调用`);
    return null;
  }

  const defaultProps = Object.assign({
    onNavigate: onNavigate,
    $T,
  }, props);

  return Plugin(defaultProps);
};