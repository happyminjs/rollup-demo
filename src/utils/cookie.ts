/**
 * Cookie 工具类
 * 
 * 支持添加、获取、删除、设置操作
 * 
 */
export default class Cookie {

    /**
     * 获取cookie值
     * 
     * @param {string} name cookie 名称
     * @return {string} 
     */
    static get(name) {
        if (typeof name !== 'undefined') {
            const reg = new RegExp(`(?:^| )${name}=([^;]*)(?:;|$)`);
            const result = reg.exec(document.cookie);
            return result && decodeURIComponent(Array.from(result)[1]) || '';
        } else {
            return document.cookie;
        }
    }

    /**
     * 添加、设置cookie值
     * 
     * @typedef CookieOptions
     * @type {Object}
     * @property {Date} expires 设置过期时间
     * @property {string} path 指定访问路径
     * @property {string} domain 指定域名
     * 
     * @param {string} name cookie 名称
     * @param {string|number} value cookie 值
     * @param {CookieOptions} [options] cookie 配置选项
     * 
     */
    static set(name, value, options) {
        if (typeof name === 'undefined' || typeof value === 'undefined') {
            throw Error(`Argument ${typeof name === 'undefined' ? 'name' : 'value'} is required.`);
        } else {
            let result = [];

            result.push([name, encodeURIComponent(value)].join('='));

            options && Object.keys(options).forEach((key) => {
                if (typeof options[key] !== 'undefined') {
                    result.push([key, options[key]].join('='));
                }
            });

            document.cookie = result.join(';');
        }
    }

    /**
     * 删除cookie值
     * @param {string} name 要删除的cookie值
     */
    static remove(name) {
        if (this.get(name)) {
            this.set(name, '', {
                expires: new Date(1970, 1, 1)
            });
        }
    }
}