/**
 * Created by Kingsley on 2017-05-19.
 */
/**
 * 时间戳转格式化的时间字符串
 * 使用方法等同smarty时间戳转换函数
 * @param {String|Date} ts 时间戳 timestamp
 * @param {String} fmt 转换的格式 关键字：{%Y: 年, %m: 月, %d: 日, %H: 时, %M: 分, %S: 秒} 例：'%Y-%m-%d %H:%M:%S' => '2017-05-19 11:11:11'
 * @param {Boolean} is_standard 是否格式化成标准格式的时间 is_standard ? '02' : '2'
 * @returns {String} 格式化后的时间字符串
 */
module.exports = (ts, fmt, is_standard = true) => {
  let datetime = new Date(ts);
  if (!ts) {
    throw new Error(`The timestamp value '${ts}' is invalid.`);
  }
  return fmt.replace(/%[YmdHMS]/g, (match) => {
    switch (match) {
      case '%Y':
        return datetime.getFullYear();
      case '%m':
        match = datetime.getMonth() + 1;
        break;
      case '%d':
        match = datetime.getDate();
        break;
      case '%H':
        match = datetime.getHours();
        break;
      case '%M':
        match = datetime.getMinutes();
        break;
      case '%S':
        match = datetime.getSeconds();
        break;
      default:
        return match;
    }
    return `${is_standard ? '0' : ''}${match}`.slice(-2);
  });
};