import { InterCollection } from '@iub-dsl/definition';

/**
 * 可以通过不同的type注册装载不同的转换器
 * inter是标准结构
 */
export const interParser = (InterC: InterCollection) => {

  const interCKeys  = Object.keys(InterC);

  interCKeys.forEach((key) => {
    console.log(InterC[key]);
    
  });
  
};
