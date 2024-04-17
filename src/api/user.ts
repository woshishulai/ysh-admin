import request from './request'
import hex_md5 from 'js-md5'
import { Base64 } from 'js-base64'
export const codeParams = (params) => {
    if (!params || typeof params !== 'object') {
        params = {} // 设置默认值为空对象
    }

    const timestamp = Math.round(Date.now() / 1000)
    const apiKey = 'YW5uaWVraWRzQXBp'
    const signature = hex_md5(`apiKey=${apiKey}&timestamp=${timestamp}`)

    // 直接转换参数为 JSON 字符串并进行 Base64 编码
    const encodedParams = Base64.encode(JSON.stringify(params))

    // 拼接 apiKey 到编码后的参数中
    const yshParam = encodedParams + apiKey

    return {
        timestamp,
        signature,
        yshParam,
    }
}

// 用户登录
export function login(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Sign/login',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

// 修改用户密码
export function changePassword(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Sign/passwordSave',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

// 获取客户列表
export function getKehuList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/User/userList',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

// 修改客户昵称
export function changeUserName(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/User/userSaveName',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}
