import { genApiReqPlugins } from "./api-req-action-extral";

export const actionExtralParser = (parseRes) => {
  const { 
    actionParseRes, ref2ValueParseRes, APIReqParseRes
  } = parseRes;

  const { reSetAction } = actionParseRes;
  const { bindRef2Value } = ref2ValueParseRes;
  const { bindAPIReq } = APIReqParseRes;

  const apiReqPlugins = genApiReqPlugins(parseRes);

  const extralParser = (conf) => {
    // console.log(conf);
    const { actionBaseConf, actionOpts } = conf;
    switch (actionBaseConf.actionType) {
      case 'changeState':
        actionOpts.changeMapping = bindRef2Value(actionOpts.changeMapping);
        break;
      case 'APIReq':
        actionOpts.apiReqRef = bindAPIReq(actionOpts.apiReqRef, apiReqPlugins);
        break;
      default:
        break;
    }
    return conf;
  };

  /** 所有action的额外的解析 */
  reSetAction((actionFnWrap) => actionFnWrap(extralParser));
};
