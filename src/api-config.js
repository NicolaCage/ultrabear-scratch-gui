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
