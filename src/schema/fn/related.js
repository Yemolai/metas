module.exports = (function () {
  /**
   * Function to get related model instance from integer FK
   * assuming PK is 'id' column
   * @param {Model} model Sequelize Model instance
   * @param {string} field fk column name
   * @return {function} wrapper to findById
   */
  const getN1 = (model, fk) => (obj => model.findById(obj[fk]))

  /**
   * Function to get model instances related to integer FK
   * assuming PK is 'id' column
   * @param {Model} model Sequelize Model instance
   * @param {string} fk fk column name
   * @return {function} wrapper to findAll
   */
  const get1N = (model, fk) => (obj => model.findAll({ where: { [fk]: obj.id }}))

  /**
   * Function to get model instances related to integer FK
   * assuming PK is 'id' column
   * @param {Model} model Sequelize Model instance
   * @param {string} fk fk column name
   * @param {function} filter function to apply in result array
   * @return {function} wrapper to findAll.filter
   */
  const getFiltered1N = (model, fk, filter) => obj => get1N(model, fk)(obj)
    .then(N => N.filter(filter(N, obj)))

  return { getN1, get1N, getFiltered1N }
}())