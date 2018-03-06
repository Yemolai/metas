const isNumber = value =>!isNaN(Number(value));

// Sequelize database instance/reference/models
const db = require('../models');
const Op = db.Sequelize.Op;

// Scalar type creation tools
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

// ex:
// getLastvalue(db.Atualizacao, 'estado', 'meta', 'id') generate:
// Meta => db.Atualizacao.findOne({
//   attributes: ['id', 'estado'],
//   order: [['id', 'DESC']],
//   where: { meta: Meta.id, estado: { [Op.not]: null } }
// }).then(e => (e ? e.estado : null))

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
 * the original value if there are no updates to the field
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

module.exports = {
  // custom Obj type to use in schema
  Obj: new GraphQLScalarType({
    name: 'Obj',
    description: 'JSON object',
    parseValue(value) {
      return JSON.parse(value);
    },
    serialize(value) {
      return JSON.stringify(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      }
      return null;
    }
  }),
  // custom Date type to use in the schema
  Date: new GraphQLScalarType({
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
  }),
  // Type Usuario related to the model Usuario
  Usuario: {
    permissoes: getN1(db.Permissao, 'permissoes'),
    setor: getN1(db.Setor, 'setor'),
    coordenadoria: getN1(db.Setor, 'coordenadoria')
  },
  Setor: {
    autor: getN1(db.Usuario, 'autor'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    coordenadorias: get1N(db.Coordenadoria,'setor')
  },
  Coordenadoria: {
    setor: getN1(db.Setor, 'setor'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    autor: getN1(db.Usuario, 'autor'),
    metas: (_, { submetas, limit, offset }) => {
      let conditions = {
        where: {},
        limit: isNumber(limit) ? limit : 100,
        offset: isNumber(offset) ? offset : 0
      }
      if (submetas === false) {
        conditions[pai] = null
      }
      if (!isNaN(Number(limit))) {
        conditions[limit] = limit
      }
      if (!isNaN(Number(offset))) {
        conditions[offset] = offset
      }
      return db.Meta.findAll(conditions)
    }
  },
  Meta: {
    resumo: getLastValue(db.Atualizacao, 'resumo', 'meta'),
    estado: getLastValue(db.Atualizacao, 'estado', 'meta'),
    atualizado: getLastValue(db.Atualizacao, 'createdAt', 'meta'),
    escopo_previsto: getNonNullLastValue(db.Atualizacao, 'escopo_previsto', 'meta'),
    escopo_realizado: getLastValue(db.Atualizacao, 'escopo_realizado', 'meta'),
    inicio_previsto: getNonNullLastValue(db.Atualizacao, 'inicio_previsto', 'meta'),
    inicio_realizado: getLastValue(db.Atualizacao, 'inicio_realizado', 'meta'),
    fim_previsto: getNonNullLastValue(db.Atualizacao, 'fim_previsto', 'meta'),
    fim_realizado: getLastValue(db.Atualizacao, 'fim_realizado', 'meta'),
    custo_previsto: getNonNullLastValue(db.Atualizacao, 'custo_previsto', 'meta'),
    custo_realizado: getLastValue(db.Atualizacao, 'custo_realizado', 'meta'),
    pai: getN1(db.Meta, 'pai'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    coordenadoria: getN1(db.Coordenadoria, 'coordenadoria'),
    autor: getN1(db.Usuario, 'autor'),
    submetas: get1N(db.Meta, 'pai'),
    atualizacoes: get1N(db.Atualizacao, 'meta')
  },
  Atualizacao: {
    meta: getN1(db.Meta, 'meta'),
    pai: getN1(db.Meta, 'pai'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    coordenadoria: getN1(db.Coordenadoria, 'coordenadoria'),
    autor: getN1(db.Usuario, 'autor')
  },
  Query: {
    permissoes: (_, { filter }) => db.Permissao.findAll(filter ? { filter } : {}),
    permissao: (_, { id }) => db.Permissao.findById(id),
    usuarios: (_, { filter }) => db.Usuario.findAll(filter ? { filter } : {}),
    usuario: (_, { id }) => db.Usuario.findById(id),
    setores: (_, { filter }) => db.Setor.findAll(filter ? { filter } : {}),
    setor: (_, { id }) => db.Setor.findById(id),
    // coordenadorias: (_, { filter }) => db.Coordenadoria.findAll(filter ? { filter } : {}),
    coordenadoria: (_, { id }) => db.Coordenadoria.findById(id),
    // metas: (_, { filter }) => db.Meta.findAll(filter ? { filter } : {}),
    meta: (_, { id }) => db.Meta.findById(id),
    atualizacoes: _ => db.Atualizacao.findAll()
  },
  Mutation: {
    deleteAtualizacao: (_, { id }) => db.Atualizacao.findById(id)
      .then(atualizacao => atualizacao.destroy())
      .then(() => id)
      .catch(() => 0),
    addAtualizacao: (_, args) => {
      return db.Atualizacao.create({
        titulo: args.titulo || null,
        resumo: args.resumo || null,
        estado: args.estado || null,
        escopo_previsto: args.escopo_previsto || null,
        escopo_realizado: args.escopo_realizado || null,
        inicio_previsto: args.inicio_previsto || null,
        inicio_realizado: args.inicio_realizado || null,
        fim_previsto: args.fim_previsto || null,
        fim_realizado: args.fim_realizado || null,
        custo_previsto: args.custo_previsto || null,
        custo_realizado: args.custo_realizado || null,
        autor: args.autor || null,
        meta: args.meta,
        responsavel: args.responsavel || null,
        pai: args.pai || null,
        coordenadoria: args.coordenadoria || null,
      })
    },
    deleteMeta: (_, { id }) => db.Meta.findById(id)
      .then(meta => meta.destroy())
      .then(() => id)
      .catch(() => 0),
    addMeta: (_, args) => {
      if (!args.titulo) {
        return null
      }
      return db.Meta.create({
        titulo: args.titulo,
        escopo_previsto: args.escopo_previsto || null,
        inicio_previsto: args.inicio_previsto || null,
        fim_previsto: args.fim_previsto || null,
        custo_previsto: args.custo_previsto || null,
        pai: args.pai || null,
        responsavel: args.responsavel || null,
        coordenadoria: args.coordenadoria || null,
        autor: args.autor || null
      })
    },
    deleteCoordenadoria: (_, { id }) => db.Coordenadoria.findById(id)
      .then(coord => coord.destroy())
      .then(() => id)
      .catch(() => 0),
    addCoordenadoria: (_, args) => {
      let required = ['nome', 'sigla']
      for (r of required) {
        if (args[r] === null) {
          return null
        }
      }
      return db.Coordenadoria.create({
        nome: args.nome,
        sigla: args.sigla,
        endereco: args.endereco || null,
        telefone: args.telefone || null,
        ramal: args.ramal || null,
        setor: args.setor,
        responsavel: args.responsavel || null,
        autor: args.autor || null,
      })
    },
    deleteUsuario: (_, { id }) => db.Meta.findById(id)
      .then(usr => usr.destroy())
      .then(() => id)
      .catch(() => 0),
    addUsuario: (_, args) => {
      // required fields
      if (!('usuario' in args && 'nome' in args && 'permissoes' in args)) {
        return null;
      }
      return db.Usuario.create({
        guid: args.guid || null,
        matricula: args.matricula || null,
        nome: args.nome,
        usuario: args.usuario,
        senha: args.senha || null,
        permissoes: args.permissoes,
        setor: args.setor || null,
        coordenadoria: args.coordenadoria || null
      })
    },
    deleteSetor: (_, { id }) => db.Setor.findById(id)
        .then(setor => setor.destroy())
        .then(() => id)
        .catch(() => 0),
    addSetor: (_, args) => {
      if (!('sigla' in args && 'nome' in args)) {
        return null;
      }
      return db.Setor.create({
        sigla: args.sigla,
        nome: args.nome,
        endereco: args.endereco || null,
        telefone: args.telefone || null,
        ramal: args.ramal || null,
        responsavel: args.responsavel || null,
        autor: args.autor || null
      })
    },
    deletePermissao: (root, args) => db.Permissao.findById(args.id)
        .then(permissao => permissao.destroy())
        .then(() => args.id)
        .catch(() => 0),
    addPermissao: (_, args) => db.Permissao.create({
        nome: args.nome,
        setor_create: args.setor_create ? args.setor_create : false,
        setor_read: args.setor_read ? args.setor_read : false,
        setor_update: args.setor_update ? args.setor_update : false,
        setor_delete: args.setor_delete ? args.setor_delete : false,
        coord_create: args.coord_create ? args.coord_create : false,
        coord_read: args.coord_read ? args.coord_read : false,
        coord_update: args.coord_update ? args.coord_update : false,
        coord_delete: args.coord_delete ? args.coord_delete : false,
        meta_create: args.meta_create ? args.meta_create : false,
        meta_read: args.meta_read ? args.meta_read : false,
        meta_update: args.meta_update ? args.meta_update : false,
        meta_delete: args.meta_delete ? args.meta_delete : false,
        atual_create: args.atual_create ? args.atual_create : false,
        atual_read: args.atual_read ? args.atual_read : false,
        atual_update: args.atual_update ? args.atual_update : false,
        atual_delete: args.atual_delete ? args.atual_delete : false,
        own_setor_update: args.own_setor_update ? args.own_setor_update : false,
        own_setor_delete: args.own_setor_delete ? args.own_setor_delete : false,
        own_coord_update: args.own_coord_update ? args.own_coord_update : false,
        own_coord_delete: args.own_coord_delete ? args.own_coord_delete : false,
        own_meta_update: args.own_meta_update ? args.own_meta_update : false,
        own_meta_delete: args.own_meta_delete ? args.own_meta_delete : false,
        own_atual_update: args.own_atual_update ? args.own_atual_update : false,
        own_atual_delete: args.own_atual_delete ? args.own_atual_delete : false,
      })
        .then((permissao) => permissao)
  },
};