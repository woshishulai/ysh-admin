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

//获取banner列表
export function getBannerList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: '/v1/bm/Banner/bannerList',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
//修改banner
export function addBannerList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: '/v1/bm/Banner/bannerAddOrEdit',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
//删除banner
export function delBannerList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: '/v1/bm/Banner/bannerDel',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
