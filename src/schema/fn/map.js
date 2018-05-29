/**
 * Functional Object Map Method
 * @param {Function} fn function to execute in each Object Property
 * @returns {Object}
 */
const map = fn => obj => {
  const result = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = fn(obj[keys[i]]);
  }
  return result;
}
module.exports = map
