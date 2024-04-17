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

//获取审批列表
export function getShenList(data) {
    const encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Applyfor/applyforList',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//审批
export function changeShenList(data) {
    const encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Applyfor/applyRatify',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}
