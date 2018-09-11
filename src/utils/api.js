import axios from 'axios';
import { AsyncStorage } from 'react-native';
import authStore from '../stores/authStore';

/* 필요시 __DEV__ 로 개발환경 구분 (React Native) */
const REACT_APP_API_ENDPOINT = Expo.Constants.manifest.extra.REACT_APP_API_ENDPOINT;
const REACT_APP_API_VERSION = Expo.Constants.manifest.extra.REACT_APP_API_VERSION;
const API_ROOT = `${REACT_APP_API_ENDPOINT}api/${REACT_APP_API_VERSION}`;

class API {
  constructor(baseURL = null) {
    this.axios = axios.create({ baseURL });
  }

  /* 
   * 추후 자동으로 basic end points(GET, PUT...)를 생성하는 로직이 필요하다고 여겨질 때 참고
   * https://codeburst.io/how-to-call-api-in-a-smart-way-2ca572c6fe86
   */

  /* APIs */
  // User and Auth
  signup(userInfo) {
    return this.post(`signup/`, userInfo);
  }

  login(id, password) {
    return this.post(`users/login/`, {
      id,
      password
    });
  }

  logout() {
    return this.delete(`users/logout/`);
  }

  getUser(userUUID) {
    return this.get(`users/${userUUID}/`);
  }

  // TradingPairs
  getTradingPairs() {
    return this.get(`trading_pairs/`);
  }
  
  /* Base REST API method */
  get(url) {
    return this.axios
      .get(url, this._getRequestConfig())
      .catch(this._handleError);
  }
  put(url, body) {
    return this.axios
      .put(url, body, this._getRequestConfig())
      .catch(this._handleError);
  }
  post(url, body) {
    return this.axios
      .post(url, body, this._getRequestConfig())
      .catch(this._handleError);
  }
  delete(url) {
    return this.axios
      .delete(url, this._getRequestConfig())
      .catch(this._handleError);
  }
  _getRequestConfig() {
    let requestConfig = null;
    let accessToken = AsyncStorage.getItem('accessToken');
    if (accessToken) {
      requestConfig = { headers: { 'Authorization': `Bearer ${accessToken}` }};
    }
    return requestConfig;
  }
  _handleError(error) {
    // error code에 따른 처리
    if (error && error.response && error.response.status === 401) {
      authStore.logout();
    }
    return error;
  }
}

const api = new API(API_ROOT);

export default api;