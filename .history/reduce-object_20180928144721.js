/**
 * 对象数组去重
 * @param {String|Array} argarr => 需要去重的对象数组
 * 参数2: property => 去重的依据属性
 */
module.exports = (arr, property) => {
    arr.reduce((cur, next) => {
        obj[next[property]] ? '' : obj[next[property]] = true && cur.push(next);
        return cur;
    })
}