import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import storage from 'store';


interface RefreshTokenInfo {
  refresh_token:string,
  access_token:string, 
  expires_in:string,
  refreshTime:number,
}
class RefreshToken {
  baseURL: string = '';
  subscribers: Array<any> = [];
  private static _instance: RefreshToken;
  public static getInstance() {
    if (!this._instance) {
      this._instance = new RefreshToken();
    }
    return this._instance;
  }

  checkStatus(response: AxiosResponse, baseURL:string): Promise<any> {
      this.baseURL = baseURL;
      console.log(this.requestState.getIsRefresh());
      if (!this.requestState.getIsRefresh()) {
        this.requestState.setIsRefresh(true);
        this.refreshTokenRequst();
      }
      console.log(this.requestState.getIsRefresh());
      let config = _.cloneDeep(response.config);
      return new Promise(resolve => {
        this.addSubscriber((token: string) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            resolve($A_R.request(config));
          }
        });
      });
  }
  // 数据管理
  requestState = {
    getCode:()=>{
      return storage.get("app/code")
    },
    getToken:function(){
      return storage.get(`app/${this.getCode()}/token`)
    },
    getRefreshTokenInfo: function(){
      return storage.get(`app/${this.getCode()}/refreshTokenInfo`)
    },
    setToken:function(token:string){
      return storage.set(`app/${this.getCode()}/token`, token);
    },
    setRefreshTokenInfo:function(refreshTokenInfo:RefreshTokenInfo){
      return storage.set(`app/${this.getCode()}/refreshTokenInfo`,refreshTokenInfo)
    },
    setIsRefresh:function(isRefreshing:boolean){
      return storage.set(`app/${this.getCode()}/isRefreshing`, isRefreshing);
    },
    getIsRefresh:function(){
      return storage.get(`app/${this.getCode()}/isRefreshing`)
    }
  }
  refreshTokenRequst() {
    try {
      const refreshTokenInfo = this.requestState.getRefreshTokenInfo();
      if(new Date().getTime() - refreshTokenInfo.refreshTime < 10000){
        this.onAccessTokenFetched(refreshTokenInfo.access_token);
        this.requestState.setIsRefresh(false);
      } else {
        const refreshTokenParams = {
          grant_type: 'refresh_token',
          refreshToken: refreshTokenInfo.refresh_token,
          client_id: storage.get("client_id"),
          client_secret: storage.get("client_secret")
        }
        axios.post(this.baseURL + '/auth/oauth/token', refreshTokenParams).then((tokenInfo: any) => {
          let { refresh_token, access_token, expires_in } = tokenInfo.result;
          this.requestState.setToken(access_token);
          this.requestState.setRefreshTokenInfo({ refresh_token, access_token, expires_in, refreshTime: new Date().getTime()});
          this.onAccessTokenFetched(access_token);
          this.requestState.setIsRefresh(false);
        },()=>{
          this.requestState.setIsRefresh(false);
        });
      }
      
    } catch (e) {
      this.requestState.setIsRefresh(false);
      // todo 跳到登录页
    }
  }

  onAccessTokenFetched(tokenId: string) {
    this.subscribers.forEach(func => {
      func(tokenId);
    });
    this.subscribers = [];
  }

  addSubscriber(func: Function) {
    this.subscribers.push(func);
  }
}

export default RefreshToken.getInstance();
