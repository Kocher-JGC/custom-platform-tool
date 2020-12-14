import axios from 'axios';
import { RemoteTable } from '@src/page-data/types';
import { genUrl } from '../utils';

/**
 * post获取 http://192.168.14.181:6090/paas/hy/7899/data/v1/tables/tableWithAux
 * {
  "tables":[
     {
        "tableId":"1330688851571777536",
        "addWithAuxTable":false
     },{
        "tableId":"1330688706906038272",
        "addWithAuxTable":false
     }
    ]
  }
 * list获取 http://192.168.14.181:6090/paas/hy/7899/data/v1/tables/list
 * 默认100条一页
 * get获取 http://192.168.14.181:6090/paas/hy/7899/data/v1/tables/${tableId}
 */
export const getRemoteTableMeta = async ({ token, lessee, app, tableId }): Promise<RemoteTable | false> => {
  const url = await genUrl({ lessee, app });
  const reqUrl = `${url}/data/v1/tables/${tableId}`;
  const resData = await axios
    .get(reqUrl, {
      headers: {
        Authorization: token
      }
    });
  const data = resData?.data?.result;
  // console.log('------------ Table Data -----------');
  // console.log(data);
  if (data) {
    return data;
  }
  // return {
  //   err: JSON.stringify(resData.data)
  // };
  return false;
};

export const getRTablesMeta = async (tableIds: string[], { token, lessee, app }) => {
  const url = await genUrl({ lessee, app });
  const reqUrl = `${url}/data/v1/tables/tableWithAux`;
  console.log(tableIds);

  const resData = await axios
    .post(reqUrl, {
      tables: tableIds.map(id => ({ tableId: id, addWithAuxTable: false }))
    }, {
      headers: {
        Authorization: token
      }
    });
  const data = resData?.data?.result;
  // console.log('------------ Table Data -----------');
  // console.log(data);
  if (data) {
    return data;
  }
  return [];
};
