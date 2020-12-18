import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import { getClientId, getClientSecret, getIsRefresh, getRefreshTokenInfo, setIsRefresh, setRefreshTokenInfo, setToken } from './store-state-manager';

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
      console.log(getIsRefresh());
      if (!getIsRefresh()) {
        setIsRefresh(true);
        this.refreshTokenRequst();
      }
      console.log(getIsRefresh());
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
  refreshTokenRequst() {
    try {
      const refreshTokenInfo = getRefreshTokenInfo();
      if(new Date().getTime() - refreshTokenInfo.refreshTime < 10000){
        this.onAccessTokenFetched(refreshTokenInfo.access_token);
        setIsRefresh(false);
      } else {
        const refreshTokenParams = {
          grant_type: 'refresh_token',
          refreshToken: refreshTokenInfo.refresh_token,
          client_id: getClientId(),
          client_secret: getClientSecret()
        }
        axios.post(this.baseURL + '/auth/oauth/token', refreshTokenParams).then((tokenInfo: any) => {
          let { refresh_token, access_token, expires_in } = tokenInfo.result;
          setToken(access_token);
          setRefreshTokenInfo({ refresh_token, access_token, expires_in, refreshTime: new Date().getTime()});
          this.onAccessTokenFetched(access_token);
          setIsRefresh(false);
        },()=>{
          setIsRefresh(false);
        });
      }
      
    } catch (e) {
      setIsRefresh(false);
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
