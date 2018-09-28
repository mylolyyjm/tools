/**
 * 字段转换 字符串与数组的互相转换
 * - 字符串作为参数时，自动删除头尾空格
 * - 字符串分隔符默认为','
 *
 * @param {String|Array} arg - [split]拼接的字符串或数组
 * @param {String} split - 拼接符号，默认为','
 * @returns {Array|String|undefined} 转换的数组或字符串，参数错误时返回undefined
 */
function parse(arg, split = ',') {
  if (typeof arg === 'string') {
    arg = arg.trim();
    if (arg === '') {
      return [];
    }
    return arg.split(split);
  }
  if (arg instanceof Array) {
    return arg.join(split);
  }
  console.error(`Parse failed: argument '${arg}' was wrong!`);
}

module.exports = parse;