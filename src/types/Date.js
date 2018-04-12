// Scalar type creation tools
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  /**
   * Parse the number value received from the client to Date obj
   * @param {number} value number received from client
   * @return {Date} Date object generated from received value
   */
  parseValue(value) { // value from the client
    return new Date(value);
  },
  /**
   * Serialize Date object into number value to send
   * @param {*} value can receive multiple types as it can be null
   * @return {number} 
   */
  serialize(value) {
    return value instanceof Date ? value.getTime() : null; // value sent to the client
  },
  /**
   * Parse a literal object to verify its integrity
   * @param {*} ast 
   * @return {*} a number if successful, null otherwise
   */
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
})

module.exports = DateType