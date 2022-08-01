
import axios from 'axios'
let querystring = require('querystring')
import Cookies from 'js-cookie'
import { downloadExcel } from '@/common/functions/utils'

axios.interceptors.request.use(function (config) {
    // 防csrf 攻击
    let csrfToken = Cookies.get('csrfToken')
    if (csrfToken) {
        config.headers['x-csrf-token'] = csrfToken
    }
    // desktop使用token实识身份
    let token = localStorage.getItem('token')
    if (token) {
        config.headers['token'] = token
        config.headers['version'] = window.appVersion || ''
    }
    return config
}, err => {
    this.$message.error('请求超时');
    return Promise.resolve(err)
})

/**
 * 添加ajax response interceptor
 */
// eslint-disable-next-line complexity
axios.interceptors.response.use(function (res) {
    let data = res.data
    let code = data.code
    if (typeof data === 'string') {
        data = JSON.parse(data)
    }

    if (data instanceof Blob) {
        const url = URL.createObjectURL(data)
        const headerFilename = res.headers['content-disposition'].split('filename=')
        const name = headerFilename.length > 1 ? decodeURIComponent(headerFilename[1].replace(/\"/g, '')) : ''
        downloadExcel(url, name)
        return res
    }

    if (code === 0 || code == 200 || isNaN(code)) {
        return data
    } else {
        // 未登录状态
        if (code === 1000000500) {
            if (process.env.IS_CLIENT) {
                if (!localStorage.getItem('token')) {
                    window.router.push('login')
                }
            } else {
                if (data.data && data.data.redirectUrl) {
                    let url = window.location.href
                    let oaToken = sessionStorage.getItem('oaToken')
                    // eslint-disable-next-line max-depth
                    if (!localStorage.getItem('token') && !oaToken) {
                        window.location.href = data.data.redirectUrl + encodeURIComponent(url)
                    }
                } else {
                    this.$message.error(data.msg);
                }
            }
            return Promise.reject(data)
        }
        // 不弹toast的错误码，需自己处理
        if (code === 2000010086 || code === 1000010003 || code === 1000010004 || code === 1000010002 || code === 1000010001) {
            return Promise.reject(data)
        }
        this.$message.error(data.msg || '系统异常');
        return Promise.reject(data)
    }
}, function (error) {
    let response = error.response
    let data = response.data
    let status = error.response.status
    // 401 表明没有权限，跳转到登录页，与 status 200 code为1000000500 逻辑类似
    if (status === 401) {
        let url = window.location.href
        let oaToken = sessionStorage.getItem('oaToken') || localStorage.getItem('oaToken')
        if (!data.data.redirectUrl) {
            this.$message.error(data.msg || '系统异常');
        } else {
            if (!localStorage.getItem('token') && !oaToken) {
                window.location.href = data.data.redirectUrl + encodeURIComponent(url)
                return
            }
        }
    // 服务器异常，显示错误页面
    } else if (status === 502) {
        let errorPageUrl = 'https://download.huatu.com/502'
        document.write(`<iframe id="error-500" style="width:100%; height: 100%;" scrolling="no" boder="0" marginheight="0" marginwidth="0" frameborder="0" src="${errorPageUrl}"></iframe>`)
        // 监听iframe来的刷新事件
        window.addEventListener('message', (event) => {
            if (event.data.type === 'refresh') {
                window.location.reload()
            }
        })
        document.close()
        return
    }

    if (!response) {
        this.$message.error('无网络链接，请检查后重试');
    } else {
        this.$message.error((data && data.msg ? data.msg : '系统异常'));
    }
    return Promise.reject(error)
})

/**
 * 发送 post 请求
 *
 * @param {string} url 请求 url
 * @param {Object} data 发送的数据
 * @return {Promise}
 */
export function post(url, data = {}) {
    return axios.post(url, querystring.stringify(data))
}

export async function postWithJson(url, data = {}) {
    return axios.post(url, data)
}

/**
 * 发送post请求接受blob
 * @param url 请求api
 * @param data 请求参数
 * @returns Promise
 */
export function axiosPostBlob(url, data = {}) {
    return axios({
        method: 'post',
        url: url,
        data: data,
        responseType: 'blob',
    })
}

/**
 * 发送post请求接受blob
 * @param url 请求api
 * @param data 请求参数
 * @returns Promise
 */
export function axiosGetBlob(url, data = {}) {
    return axios({
        method: 'get',
        url: url,
        params: data,
        responseType: 'blob',
    })
}

/**
 * post form参数请求
 *
 * @param {string} url 请求 url
 * @param {Object} data 发送的数据
 * @return {Promise}
 */
export function form(url, data = {}) {
    return axios.post(url,
        querystring.stringify(data),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )
}

/**
 * 发送 delete 请求
 *
 * @param {string} url 请求 url
 * @param {Object} data 发送的数据
 * @return {Promise}
 */
export function del(url, data = {}) {
    return axios.delete(url, {
        params: data
    })
}

/**
 * 发送 get 请求
 *
 * @param {string} url 请求 url
 * @param {Object} data 发送的数据
 * @return {Promise}
 */
export function get(url, data = {}) {
    return axios.get(url, {
        params: data
    })
}

/**
 * 发送 update 请求
 *
 * @param {string} url 请求 url
 * @param {Object} data 发送的数据
 * @return {Promise}
 */
export function put(url, data = {}) {
    return axios.put(url, data)
}
