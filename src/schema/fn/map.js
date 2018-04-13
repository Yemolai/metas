// functional map to use with objects
module.exports = fn => obj => {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = fn(obj[keys[i]]);
  }
  return result;
}