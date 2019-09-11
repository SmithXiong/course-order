import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Router from 'vue-router'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = `Token ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error)
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 'HTTP_200_OK' || res.code === 'HTTP_201_CREATED' || res.auth_token || response.status === 204) {
      return res
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
/*      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))*/
    } else {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      });
    }
  },
  error => {
    console.log('err' + error); // for debug
    let message = error.message;
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message
    }
    if (error.response && error.response.data && error.response.data.non_field_errors) {
      message = error.response.data.non_field_errors[0]
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    });
    if (error.response && error.response.status && (error.response.status === 401 || error.response.status === 403)) {
      MessageBox.confirm('您必须重新登录', '确认退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          router.replace({name: 'Login'})
        })
      })
    }
    return Promise.reject(error)
  }
);

export default service
