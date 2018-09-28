/**
 * Created by Kingsley on 2017-05-20.
 */
module.exports = (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        if (Object.prototype.toString.call(value) === '[object Object]') {
          let real_value = value.value;
          if (!value.clearable) {
            obj[key] = real_value;
            continue;
          }
          obj[key] = value = real_value;
        }
        if (value === undefined || value === '' || value === null || (value instanceof Array && value.length === 0)) {
          delete obj[key];
        }
      }
    }
  };