import axios from 'axios';
// import authStore from '../stores/authStore';
import { AsyncStorage } from "react-native"

let REACT_APP_API_ENDPOINT = null;
let REACT_APP_API_VERSION = null;
// if (__DEV__) {
//   REACT_APP_API_ENDPOINT = Expo.Constants.manifest.extra.DEV_API_ENDPOINT;
// } else {
// REACT_APP_API_ENDPOINT = Expo.Constants.manifest.extra.REACT_APP_API_ENDPOINT;
// REACT_APP_API_VERSION = Expo.Constants.manifest.extra.REACT_APP_API_VERSION;
// }  
REACT_APP_API_ENDPOINT = Expo.Constants.manifest.extra.REACT_APP_API_ENDPOINT;
REACT_APP_API_VERSION = Expo.Constants.manifest.extra.REACT_APP_API_VERSION;

const API_ROOT = 
  // __DEV__ ?
  //   `http://${REACT_APP_API_ENDPOINT}/` :
    `${REACT_APP_API_ENDPOINT}api/${REACT_APP_API_VERSION}`;

class API {
  constructor(baseURL = null) {
    this.axios = axios.create({ baseURL });
  }

  /* 추후 자동으로 basic end points를 생성하는 로직이 필요하다고 여겨질 때 참고
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

  getTradingPairs() {
    return this.get(`trading_pairs/`);
  }
  
  /* Base REST API method */
  get(url) {
    return this.axios
      .get(url, this.getRequestConfig())
      .catch(this.handleUnauthorizedError);
  }
  put(url, body) {
    return this.axios
      .put(url, body, this.getRequestConfig())
      .catch(this.handleUnauthorizedError);
  }
  post(url, body) {
    return this.axios
      .post(url, body, this.getRequestConfig())
      .catch(this.handleUnauthorizedError);
  }
  delete(url) {
    return this.axios
      .delete(url, this.getRequestConfig())
      .catch(this.handleUnauthorizedError);
  }
  getRequestConfig() {
    let requestConfig = null;
    let accessToken = commonStore.token;
    if (accessToken) {
      requestConfig = { headers: { 'Authorization': `Bearer ${accessToken}` }};
    }
    return requestConfig;
  }
  handleUnauthorizedError(error) {
    if (error && error.response && error.response.status === 401) {
      // authStore.logout();
    }
    return error;
  }

}

const api = new API(API_ROOT);

export default api;