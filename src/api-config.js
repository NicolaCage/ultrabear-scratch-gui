let backendHost;
let authHost;
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

export const API_ROOT = `${backendHost}`;
export const AUTH_ROOT = `${authHost}`;


export const URL = 'https://www.ultrabear.com.cn';
export const WECHAT_SCAN_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/wechat/coding";
export const USER_INFO_API_URL = "https://www.ultrabear.com.cn/auth/api/v1.0/user/info";
export const ASSETS_ROOT = "https://assets.ultrabear.com.cn";
export const WORKSPACE_SOCKET_URL = 'wss://assets.ultrabear.com.cn/ws/connect';
export const SCRATCH_SERVER_BASE = 'https://assets.ultrabear.com.cn/scratch';