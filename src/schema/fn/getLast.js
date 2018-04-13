module.exports = (function () {
  const Op = require('sequelize').Op
  /**
   * Generates a function to get the last selected non-null value 
   * available in a table filtering to other table's id
   * @param {Model} model Sequelize model instance to get the value from
   * @param {string} field The desired value column name
   * @param {string} from The fk reference relation column to filter
   * @param {string} id The relation pk to refer in filter
   * @return {function} function to get the last non-null selected value
   */
  const getLastValue = (model, field, from, id = 'id') => (
    obj => model.findOne({
      attributes: [id, field],
      order: [[id, 'DESC']],
      where: { [from]: obj[id], [field]: { [Op.not]: null } }
    }).then(result => (result ? result[field] : null))
  )

  // getNonNullLastValue(db.Atualizacao, 'escopo_previsto', 'meta') generates:
  // escopo_previsto: meta => getLastValue(db.Atualizacao, 'escopo_previsto', 'meta')(meta)
  //   .then(value => value === null ? meta.escopo_previsto : value)
  /**
   * Generates a function to get the last selected non-null value
   * available in a table filtering to other table's id and returns
   * the original value if there are no updates to the field.
   * @param {Model} model Sequelize model instance to get the value from
   * @param {string} field The desired value column name
   * @param {string} from The fk reference relation column to filter
   * @param {string} id The relation pk to refer in filter
   * @return {function} function to get the last non-null selected value
   */
  const getNonNullLastValue = (model, field, from, id = 'id') => (
    obj => getLastValue(model, field, from, id)(obj)
      .then(v => (v === null ? obj[field] : v))
  )

  /**
   * Generates a function to get the last selected non-null value
   * available in a table or the sum of the value in children elements
   * filtering to other table's id and returning the original value
   * if no updates are found.
   * @param {Model} parentModel Sequelize model instance of parent object
   * @param {Model} model Sequelize model instance to get the value from
   * @param {string} field The desired value column name
   * @param {string} from The fk reference relation column to filter
   * @param {string} id The relation pk to refer in filter
   * @param {string} parentFk The parent fk referente column to filter
   * @returns {function} function to get the last non-null selected value or the sum of the value of the related children
   */
  const getSubSumOrNonNullLastValue = (parentModel, model, field, from, id = 'id', parentFk = 'pai') => (
    getSubSumOr(getNonNullLastValue(model, field, from, id), parentModel, id, parentFk)
  )

  /**
   * Generates a function to get the last selected nullable value
   * available in a table or the sum of the value in children elements
   * filtering to other table's id and returning null if no updates are found.
   * @param {Model} parentModel Sequelize model instance of parent object
   * @param {Model} model Sequelize model instance to get the value from
   * @param {string} field The desired value column name
   * @param {string} from The fk reference relation column to filter
   * @param {string} id The relation pk to refer in filter
   * @param {string} parentFk The parent fk referente column to filter
   * @returns {function} function to get the last non-null selected value or the sum of the value of the related children
   */
  const getSubSumOrLastValue = (parentModel, model, field, from, id = 'id', parentFk = 'pai') => (
    getSubSumOr(getLastValue(model, field, from, id), parentModel, id, parentFk)
  )

  /**
   * Generates a intermediate function to get the children elements
   * of given object and runs a given sum function of their selected value
   * or runs the given sum function in the object itself it no child is found.
   * @requires Bluebird
   * @param {Model} parentModel Sequelize model instance of parent object
   * @param {Model} model Sequelize model instance to get the value from
   * @param {string} field The desired value column name
   * @param {string} from The fk reference relation column to filter
   * @param {string} id The relation pk to refer in filter
   * @param {string} parentFk The parent fk referente column to filter
   * @returns {function} function to get the last non-null selected value or the sum of the value of the related children
   */
  const getSubSumOr = (lastValueMethod, parentModel, id, parentFk) => (
    (obj) => parentModel.findAll({ where: { [parentFk]: obj[id] } })
      .then(children => {
        if (children.length > 0) {
          return require('bluebird').all(children.map(child => lastValueMethod(child)))
            .reduce((p, a) => isNaN(Number(a)) ? p : p + Number(a), 0)
        } else {
          return lastValueMethod(obj)
        }
      })
  )
  return {
    getLastValue,
    getNonNullLastValue,
    getSubSumOrNonNullLastValue,
    getSubSumOrLastValue
  }
}())