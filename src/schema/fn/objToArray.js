/**
 * Converts an Object to an Array of properties removing keys
 * @param {Object} obj Object to convert to array
 * @returns {Array} Array with values from given Object
 */
module.exports = obj => (Object.keys(obj).map(k => obj[k]))
