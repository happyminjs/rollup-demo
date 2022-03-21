// @ts-nocheck
import $ from 'zepto-webpack'
// import FangLib from '@fang/optimus';
import FangLib from 'fang-flib';
export let fLib = new FangLib({
    common: {
        needEnvFunctions: false
        // trackConfig: {},
    }
});
window.flib = fLib;


interface requestData extends Object{
    // successCode?: number,
    // failCode?: number,
    // id?: any,
    [key: string]: number | string | any
}


export default class Request {
    static get(url: string, data?: requestData, otherOptions?: object) {
        let successCode = data.successCode ? data.successCode : 0;
        let failCode = data.failCode ? data.failCode : 0;
        successCode && delete data.successCode;
        failCode && delete data.failCode;
        return new Promise((resolve, reject) => {
            try {
                $.ajax({
                    type: 'GET',
                    url: url,
                    data: data,
                    dataType: 'json',
                    ...otherOptions,
                    success: res => {
                        successCode && fLib.track.sendWM(successCode);
                        return resolve(res)
                    },
                    error: err => {
                        failCode && fLib.track.sendWM(failCode);
                        return reject(err)
                    }
                })
            } catch (error) {
                failCode && fLib.track.sendWM(failCode);
                reject(error)
            }
        })
    }

    static post(url: string, data?: requestData, otherOptions?: object) {
        let successCode = data.successCode ? data.successCode : 0;
        let failCode = data.failCode ? data.failCode : 0;
        successCode && delete data.successCode;
        failCode && delete data.failCode;
        return new Promise((resolve, reject) => {
            try {
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    ...otherOptions,
                    success: res => {
                        successCode && fLib.track.sendWM(successCode);
                        return resolve(res.data)
                    },
                    error: err => {
                        failCode && fLib.track.sendWM(failCode);
                        return reject(err);
                    }
                })
            } catch (error) {
                failCode && fLib.track.sendWM(failCode);
                reject(error)
            }
        })
    }

    
    static jsonp(url: string, data?: requestData, jsonp?: string, timeout?: number,otherOptions?: object) {
        let successCode = data.successCode ? data.successCode : 0;
        let failCode = data.failCode ? data.failCode : 0;
        successCode && delete data.successCode;
        failCode && delete data.failCode;
        return new Promise((resolve, reject) => {
            try {
                $.ajax({
                    type: 'GET',
                    url: url,
                    data: data,
                    dataType: 'jsonp',
                    jsonp: jsonp,
                    timeout: timeout,
                    ...otherOptions,
                    success: res => {
                        successCode && fLib.track.sendWM(successCode);
                        return resolve(res);
                    },
                    error: err => {
                        failCode && fLib.track.sendWM(failCode);
                        return reject(err)
                    },
                })
            } catch (error) {
                failCode && fLib.track.sendWM(failCode);
                reject(error)
            }
        })
    }
}


// 使用例子
// let url = '/zufang/wechat/rent/api_get_list?action=getList&page=1&openid=o6fYj0Q7FdcshE2uClsnthNaBik0&cityId=1&city_id=1'
// Request.get(url).then(data => {
//     console.log('api_get_list: ', data)
// }).catch(err => {
//     console.log(err);
// })