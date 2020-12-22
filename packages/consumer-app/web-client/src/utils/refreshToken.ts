import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import { getClientId, getClientSecret, getIsRefresh, getPrevLoginData, getRefreshTokenInfo, removeLoginData, setIsRefresh, setPrevLoginData, setRefreshTokenInfo, setToken } from './store-state-manager';

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

  test: boolean = false;
  checkStatus(response: AxiosResponse, baseURL:string): Promise<any> {
      this.baseURL = baseURL;
      console.log(getIsRefresh());
      if (!getIsRefresh()) {

        setIsRefresh(true);
        this.refreshTokenRequst();
      }
      console.log(getIsRefresh());
      let config = _.cloneDeep(response.config);
      return new Promise((resolve,reject) => {
        this.addSubscriber((token: string) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            resolve($A_R.request(config));
          } else {
            reject({code:401})
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
          refresh_token: refreshTokenInfo.refresh_token,
          client_id: getClientId(),
          client_secret: getClientSecret()
        }
        let param = new URLSearchParams();
        Object.keys(refreshTokenParams).forEach(key => {
          param.append(key,refreshTokenParams[key])
        });
        axios.post(this.baseURL + '/auth/oauth/token', param).then((tokenInfo: any) => {
          let { refresh_token, access_token, expires_in } = tokenInfo.data;
          setToken(access_token);
          setRefreshTokenInfo({ refresh_token, access_token, expires_in, refreshTime: new Date().getTime()});
          let resData = getPrevLoginData();
          setPrevLoginData(Object.assign(resData,{ refresh_token, access_token}));
          this.onAccessTokenFetched(access_token);
          setIsRefresh(false);
        },()=>{
          setIsRefresh(false);
          this.onAccessTokenFetched('');
          removeLoginData();
          window.location.reload();
        });
      }
      
    } catch (e) {
      setIsRefresh(false);
      this.onAccessTokenFetched('');
      // todo 跳到登录页
      removeLoginData();
      window.location.reload();
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
