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

//获取评论列表
export function getPingList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentList',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//获取订单详情
export function getPingLunDetails(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentInfo',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//修改评论
export function changePingApi(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentSave',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//删除评论
export function removePing(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentDel',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//添加回复
export function addHuiFu(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentReply',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//添加申诉
export function addShenSUApi(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentAppealAdd',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//添加申诉
export function shenSuList(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentAppealInfo',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}

//修改申诉
export function changeShenSu(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentAppealSave',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}
//修改申诉
export function getShenSu(data) {
    let encryptedData = codeParams(data)
    return request({
        url: 'v1/bm/Comment/commentAppealInfo',
        method: 'post',
        headers: {
            apiKey: 'YW5uaWVraWRzQXBp',
        },
        data: encryptedData,
    })
}
