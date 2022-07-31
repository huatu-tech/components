/**
 * @module 深度拷贝
 * @author lixiaobin
 * @see http://gitlab.huatuop.com/wuyan/common-frontend/blob/master/src/functions/deepClone.js
 */

/**
 * 深度拷贝
 *
 * @param {Object} obj 需要拷贝的对象
 * @returns {Object} 拷贝副本
 */
export default function deepClone (obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepClone)
    } else if (obj && typeof obj === 'object') {
        let cloned = {}
        let keys = Object.keys(obj)
        for (let i = 0, l = keys.length; i < l; i++) {
            let key = keys[i]
            cloned[key] = deepClone(obj[key])
        }
        return cloned
    } else {
        return obj
    }
}