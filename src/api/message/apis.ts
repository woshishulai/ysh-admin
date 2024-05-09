import request from '../request'
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

//获取所有店铺聊天
export function getMessageAll(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/ChatAdmin/getShopList',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}

//添加或修改店铺详情
export function getUserMessage(data) {
    let encryptedData = codeParams(data)
    return request({
        url: '/v1/bm/ChatAdmin/getShopUsers',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}

//上传店铺信息
export function getDetailsMessage(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/ChatAdmin/getShopChatmsg',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
//未读消息
export function shopMessage(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/ChatAdmin/getNoread',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
