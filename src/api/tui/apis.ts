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

//获取退款列表
export function getTuiList(data) {
    console.log(data)

    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Order/orderRefundList',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}

//平台同意退款
export function changeTuiList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Order/orderRefund',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
//商家同意退款
export function changeShopList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Order/OrderSellerRefund',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
//改变店铺状态
export function removeAnList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Shop/shopCaseDel',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}

//上传店铺信息
export function addAnListInfo(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Shop/shopCaseAddorEdit',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}

//商家申诉
export function shangjiashensu(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Order/OrderAppeal',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp', // 这里添加了 apiKey
        },
        data: encryptedData,
    })
}
