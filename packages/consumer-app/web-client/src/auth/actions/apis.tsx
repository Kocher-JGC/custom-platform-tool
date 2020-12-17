import { message as AntdMessage } from 'antd';
export interface LoginRes {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}
export interface loginParams {
  username: string;
  password: string;
  pwd_encryption_type: number;
  client_type: number;
  lessee_code: string;
  app_code: string;
  client_id:string;
  client_secret:string;
}
export function login(data:loginParams): Promise<LoginRes> {
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
      AntdMessage.error(error);
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


export function getUsers(): Promise<any> {
  return new Promise((resolve, reject) => {
    $A_R.get("/auth/user/association/current").then((res)=>{
      resolve(res);
    },(error)=>{
      reject(error)
    })
  })
}
export interface ILastLoginReq {
  lessee_code: string;
  app_code: string;
}
export function getUserLastLogin(params:ILastLoginReq): Promise<any> {
  return new Promise((resolve, reject) => {
    $A_R.get("/auth/history/login/last?lessee_code="+params.lessee_code+"&app_code="+params.app_code).then((res)=>{
      resolve(res);
    },(error)=>{
      reject(error)
    })
  })
}

export interface modifyPwdData {
  userName: string;
  oldPwd: string;
  newPwd: string;
  pwdEncryptionType: string;
}
export function modiflyPwd(pwdData:modifyPwdData): Promise<any>{
  return new Promise((resolve, reject) => {
    $A_R.put("/auth/user/pwd", pwdData).then((res)=>{
      resolve(res);
    },(error)=>{
      reject(error)
    })
  })
}