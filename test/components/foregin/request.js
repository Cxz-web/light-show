import axios from 'axios'
import {Message, Loading} from 'element-ui'
import store from '@/store'
import {getToken, removeToken} from '@/utils/auth.js'
import router from '@/router/index.js'
import qs from 'qs'
import {baseURL} from './config.js'

const options = {spinner: 'myLoading', background: 'rgba(0,0,0,0.4)'}
let loading = null

// 自定义业务码错误信息
const STATUS_CODE = {
  500: 'ERROR_: ONE',
  405: 'ERROR_: FIRST',
  406: 'ERROR_: SECOND'
}

// aioxs 实例
const service = axios.create({
  baseURL: baseURL, // api 的 base_url
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  timeout: 10000,
  transformRequest: [function (data) {
    return qs.stringify(data)
  }]
})

// 请求config配置
service.interceptors.request.use(
  config => {
    const token = store.getters.token || getToken().token
    if (token) config.headers['Authorization'] = token
    loading = Loading.service(options)
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    if (loading) {
      loading.close()
    }
    const res = response.data
    if (res.response_code !== 10000) {
      Message({
        type: 'error',
        duration: 3000,
        message: STATUS_CODE[res.response_code.toString()] || res.response_msg || '请求失败！！！'
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },

  error => {
    if (loading) {
      loading.close()
    }
    console.log('err:' + error) // for debug
    // 没有token 或者token过期跳转到登陆界面
    if (error.toString().includes('401')) {
      Message({
        message: '请重新登陆',
        type: 'error',
        duration: 1000
      })
      store.commit('SET_TOKEN', null)
      router.push('/home/login')
    } else if (error.toString().includes('code')) {
      Message({
        message: '您的网络不好，请稍后再试！',
        type: 'error',
        duration: 2000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 2000
      })
    }
  }
)

export default service
