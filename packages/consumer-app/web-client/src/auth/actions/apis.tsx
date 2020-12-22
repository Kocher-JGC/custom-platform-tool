import { message as AntdMessage } from 'antd';
export interface LoginRes {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  use_info: {username:string};
}
export interface LoginParams {
  username: string;
  password: string;
  pwd_encryption_type: number;
  client_type: number;
  lessee_code: string;
  app_code: string;
  client_id:string;
  client_secret:string;
}
export function login(data:LoginParams): Promise<LoginRes> {
  return new Promise((resolve, reject) => {
    console.log(data)
    let param = new URLSearchParams();
    Object.keys(data).forEach(key => {
      param.append(key,data[key])
    });
    $A_R.post("/auth/login", param).then((res)=>{
      console.log(res)
      resolve(res);
    },(error)=>{
      console.log(error)
      AntdMessage.error('账号或者密码错误！');
      reject(error)
    })
  });

}

export function logout(): Promise<any> {
  return new Promise((resolve, reject) => {
    $A_R.get("/auth/oauth/revoke", {}).then((res)=>{
      resolve(res);
    },(error)=>{
      reject(error)
    })
  })
}


export function getUsersInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    $A_R.get("/auth/user/association/current").then((res)=>{
      resolve(res);
    },(error)=>{
      reject(error)
    })
  })
}
export interface LastLoginReq {
  lessee_code: string;
  app_code: string;
}
export function getUserLastLoginInfo(params:LastLoginReq): Promise<any> {
  return new Promise((resolve, reject) => {
    $A_R.get("/auth/history/login/last?lessee_code="+params.lessee_code+"&app_code="+params.app_code).then((res)=>{
      resolve(res);
    },(error)=>{
      reject(error)
    })
  })
}

export interface ModifyPwdData {
  userName: string;
  oldPwd: string;
  newPwd: string;
  pwdEncryptionType: string;
}
export function modiflyPwd(pwdData:ModifyPwdData): Promise<any>{
  return new Promise((resolve, reject) => {
    $A_R.put("/auth/user/pwd", pwdData).then((res)=>{
      resolve(res);
    },(error)=>{
      reject(error)
    })
  })
}