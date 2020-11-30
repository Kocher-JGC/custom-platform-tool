// import { getAPBDSLtestUrl } from '@consumer-app/web-platform/src/utils/gen-url';
import { notification } from 'antd';
import { AxiosResponse } from 'axios';

enum APBDSLResponeCode {
  SA0000 = 'SA0000',  SA0002 = 'SA0002',  SA0003 = 'SA0003',  SA0004 = 'SA0004',
  SA0005 = 'SA0005',  SA0006 = 'SA0006',  SA0007 = 'SA0007',  SA0008 = 'SA0008',
  SA0009 = 'SA0009',  SA0010 = 'SA0010',  SA0017 = 'SA0017',  SA0018 = 'SA0018',
  SA0019 = 'SA0019',  SA0016 = 'SA0016',  SA0012 = 'SA0012',  SA0001 = 'SA0001',
  SA0011 = 'SA0011',  SA0013 = 'SA0013',  SA0014 = 'SA0014',  SA0015 = 'SA0015',
  SA0020 = 'SA0020',  SA0021 = 'SA0021',  SA0022 = 'SA0022',  SA0023 = 'SA0023',
  SA0024 = 'SA0024',  SA0025 = 'SA0025',  SA0026 = 'SA0026',  SA0027 = 'SA0027',
  SA0028 = 'SA0028',  SA0029 = 'SA0029',
}

export const APBDSLResponseMsg = {
  [APBDSLResponeCode.SA0000]: '业务处理成功！',
  [APBDSLResponeCode.SA0002]: '请使用POST方式提交',
  [APBDSLResponeCode.SA0003]: '找不到匹配业务请求解析器！',
  [APBDSLResponeCode.SA0004]: 'SaasContext不能为NULL！',
  [APBDSLResponeCode.SA0005]: 'code必须是String！',
  [APBDSLResponeCode.SA0006]: 'params必须是Map！',
  [APBDSLResponeCode.SA0007]: '第%s个功能单元缺少%s字段！',
  [APBDSLResponeCode.SA0008]: '提取数据异常: %s',
  [APBDSLResponeCode.SA0009]: '功能码：%s，找不到匹配功能！',
  [APBDSLResponeCode.SA0010]: '业务单元: %s(%s)，没法找到匹配业务解析器',
  [APBDSLResponeCode.SA0017]: '从%s选择一个参数',
  [APBDSLResponeCode.SA0018]: '只能从%s选择一个参数',
  [APBDSLResponeCode.SA0019]: '从%s中选择一个参数',
  [APBDSLResponeCode.SA0016]: '应用未启动',
  [APBDSLResponeCode.SA0012]: '功能执行异常:%s',
  [APBDSLResponeCode.SA0001]: 'businessRequest不是FunctionCodeRequest，应用引擎无法处理！',
  [APBDSLResponeCode.SA0011]: '应用安装错误:%s',
  [APBDSLResponeCode.SA0013]: '只支持文件上传请求！',
  [APBDSLResponeCode.SA0014]: '请求内容缺少file字段！',
  [APBDSLResponeCode.SA0015]: '应用安装异常',
  [APBDSLResponeCode.SA0020]: '转换应用安装包异常:%s',
  [APBDSLResponeCode.SA0021]: '上传的应用包为空！',
  [APBDSLResponeCode.SA0022]: '远程安装应用失败: %s',
  [APBDSLResponeCode.SA0023]: '应用卸载异常',
  [APBDSLResponeCode.SA0024]: '函数功能：%s查找异常！',
  [APBDSLResponeCode.SA0025]: '找不到函数功能：%s！',
  [APBDSLResponeCode.SA0026]: '函数功能：%s执行异常！',
  [APBDSLResponeCode.SA0027]: '租户非法访问！',
  [APBDSLResponeCode.SA0028]: '应用非法访问！',
  [APBDSLResponeCode.SA0029]: '业务非法访问！',
};

interface APBDSLRespone<T = any> {
  code: APBDSLResponeCode
  msg: string
  result: T
  timestamp: string
}
export const APBDSLrequest = <R = any>(url, reqParam) => {
  // const reqUrl = genUrl('UserInfo');
  // console.dir(reqParam, { depth: 3 });
  // $A_R.interceptors.response.use((response) => {
  //   return response;
  // }, (err) => { // 这里是返回状态码不为200时候的错误处理
  //   console.log(err);

  //   return Promise.reject(err);
  // });
  return $A_R(url, {
    method: 'POST',
    data: reqParam,
  }).then((response: AxiosResponse<APBDSLRespone<R | boolean>>) => {
    console.log(response);

    const { data, status } = response;
    if (status === 200) {
      if (data.code === APBDSLResponeCode.SA0000) {
        return Promise.resolve(data.result);
      }
      notification.error({
        message: '请求失败!',
        description: APBDSLResponseMsg[data.code] || `失败了!${JSON.stringify(data)}`
      });
    }
    return Promise.resolve(false);
  }).catch((e) => {
    console.log('e.response', e);
    notification.error({
      message: APBDSLResponseMsg[e.response?.data.code || e.response?.status],
      description: e.response?.data.msg
      // description: `${JSON.stringify(e)}`
    });
  });
};