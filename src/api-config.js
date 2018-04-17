let backendHost;
let authHost;
let assetsHost;
const apiVersion = 'v1.0';

const hostname = window && window.location && window.location.hostname;

if(hostname.includes('ultrabear.com.cn')) {
  backendHost = 'https://www.ultrabear.com.cn/api/' + apiVersion;
} else {
  backendHost = (process.env.REACT_APP_BACKEND_HOST|| 'http://localhost:8081') + "/api/"+ apiVersion;
}

if(hostname.includes('ultrabear.com.cn')) {
  authHost = 'https://www.ultrabear.com.cn/auth/api/' + apiVersion;
} else {
  authHost = (process.env.REACT_APP_AUTH_HOST|| 'http://localhost:8082') + "/auth/api/"+apiVersion;
}

if(hostname.includes('ultrabear.com.cn')) {
  assetsHost = 'https://assets.ultrabear.com.cn';
} else {
  assetsHost = (process.env.REACT_APP_AUTH_HOST || 'http://localhost:8600');
}

export const API_ROOT = `${backendHost}`;
export const AUTH_ROOT = `${authHost}`;
export const ASSETS_ROOT = `${assetsHost}`;


export const URL = 'https://www.ultrabear.com.cn';
export const SUBMIT_API_URL = 'https://www.ultrabear.com.cn/teaching/api/v1.0/student/submit';
export const WECHAT_SCAN_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/wechat/student";
export const USER_INFO_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/user/info"
export const REGISTER_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/wechatregister"
export const SMS_SEND_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/sendsms"
export const SMS_CHECK_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/checksms"
export const SET_PWD_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/changepwd"

