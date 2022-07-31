
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
    // let imToken = sessionStorage.getItem('imToken')
    // // im桌面端获取token识别身份
    // if (imToken) {
    //     config.headers['token'] = imToken
    //     config.url = config.url + '?token=' + imToken + '&tokenType=PC_IM'
    // } else {
    //     if (!(/Android|webOS|iPhone|iPod|BlackBerry|htoa/i.test(navigator.userAgent))) {
    //         // 判断是社群系统
    //         let isSeed = window.location.origin.indexOf('seed') > -1
    //         // pc端
    //         if (config.url.endsWith('.m') && !isSeed) {
    //             config.url = config.url.split('.')[0] + '.json'
    //         }
    //     }
    // }
    // oa移动端获取oa的token识别身份
    // let oaToken = sessionStorage.getItem('oaToken') || localStorage.getItem('oaToken') || window.oaToken
    // if (oaToken) {
    //     config.headers['token'] = oaToken
    //     config.url = config.url + '?token=' + oaToken
    // }

    // if (process.env.IS_CLIENT) {
    //     if (process.env.env == 'prod') {
    //         config.url = 'https://im.huatu.com' + config.url
    //     } else {
    //         config.url = 'https://dev-im.huatu.com' + config.url
    //     }
    //     config.url = config.url.replace('json', 'do')
    // }
    // // 学员通token
    // let xytToken = sessionStorage.getItem('xytToken')
    // if (xytToken) {
    //     config.headers['token'] = xytToken
    // }
    return config
}, err => {
    toast('请求超时', 'error')
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
                    toast(data.msg, 'error')
                }
            }
            return Promise.reject(data)
        }
        // 不弹toast的错误码，需自己处理
        if (code === 2000010086 || code === 1000010003 || code === 1000010004 || code === 1000010002 || code === 1000010001) {
            return Promise.reject(data)
        }
        // im客户端token过期跳到登录页
        // if (code === 1000000405 && window.store) {
        //     window.store.commit('LOG_OUT', true)
        // }
        // im客户端账号登录互踢
        // if (code === 1000000406 && window.store) {
        //     window.store.commit('SHOW_LOG_OUT', true)
        // }
        // // im客户端版本强制更新
        // if (code === 1000000403 && window.store) {
        //     window.store.commit('UPDATE_VERSION', true)
        //     return Promise.reject(data)
        // }
        // // 学员通 公众号 401时 直接跳到手机号登录页
        // if (code == 401 && window.store) {
        //     window.store.dispatch('codeUnauthorized')

        //     return Promise.reject(data)
        // }

        toast(data.msg || '系统异常', 'error')
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
            toast(data.msg || '系统异常', 'error')
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
        toast('无网络链接，请检查后重试', 'error')
    } else {
        toast((data && data.msg ? data.msg : '系统异常'), 'error')
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
