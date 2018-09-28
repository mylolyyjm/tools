module.exports = (name) => {
  let SEARCH = window.location.search;
  let reg = new RegExp(`(\\?|&)${name}(\\[\\])?=([^&]*)`);
  let value = SEARCH.match(reg);

  return value ? value[3] : '';
};
