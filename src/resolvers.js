const isNumber = value =>!isNaN(Number(value));

// Sequelize database instance/reference/models
const db = require('../models');
const Op = db.Sequelize.Op;

const fn = './fn'
const types = './types'
const season = require(fn + '/season');
const {
  getLastValue,
  getNonNullLastValue,
  getSubSumOrNonNullLastValue,
  getSubSumOrLastValue
} = require(fn + '/getLast')
const { getN1, get1N, getFiltered1N } = require(fn + '/related')

const typeLoader = path => (database => (typeName => (require(path + '/' + typeName))(database)))
const load = typeLoader('./types')(db)

const Usuario = load('Usuario')
const Setor = load('Setor')

module.exports = {
  // custom Date type to use in the schema
  Date: require(types + '/Date'),
  // Type Usuario related to the model Usuario
  Usuario: Usuario.computed,
  Setor: Setor.computed,
  Coordenadoria: {
    setor: getN1(db.Setor, 'setor'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    autor: getN1(db.Usuario, 'autor'),
    metas: (_, { submetas, limit, offset }) => {
      let conditions = {
        where: { coordenadoria: _.id },
        limit: isNumber(limit) ? limit : 100,
        offset: isNumber(offset) ? offset : 0
      }
      if (submetas === false) {
        conditions.where['pai'] = {[Op.eq]: null}
      }
      if (!isNaN(Number(limit))) {
        conditions['limit'] = limit
      }
      if (!isNaN(Number(offset))) {
        conditions['offset'] = offset
      }
      console.log({conditions})
      return db.Meta.findAll(conditions)
    }
  },
  Meta: {
    titulo: getNonNullLastValue(db.Atualizacao, 'titulo', 'meta'),
    resumo: getLastValue(db.Atualizacao, 'resumo', 'meta'),
    estado: getLastValue(db.Atualizacao, 'estado', 'meta'),
    atualizado: getLastValue(db.Atualizacao, 'createdAt', 'meta'),
    escopo_previsto: getSubSumOrNonNullLastValue(db.Meta, db.Atualizacao, 'escopo_previsto', 'meta'),
    escopo_realizado: getSubSumOrLastValue(db.Meta, db.Atualizacao, 'escopo_realizado', 'meta'),
    inicio_previsto: getNonNullLastValue(db.Atualizacao, 'inicio_previsto', 'meta'),
    inicio_realizado: getLastValue(db.Atualizacao, 'inicio_realizado', 'meta'),
    fim_previsto: getNonNullLastValue(db.Atualizacao, 'fim_previsto', 'meta'),
    fim_realizado: getLastValue(db.Atualizacao, 'fim_realizado', 'meta'),
    custo_previsto: getSubSumOrNonNullLastValue(db.Meta, db.Atualizacao, 'custo_previsto', 'meta'),
    custo_realizado: getSubSumOrLastValue(db.Meta, db.Atualizacao, 'custo_realizado', 'meta'),
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
    usuarios: Usuario.query.all,
    usuario: Usuario.query.byId,
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
    addUsuario: Usuario.mutation.create,
    deleteUsuario: Usuario.mutation.delete,
    changePassword: Usuario.mutation.changePassword,
    deleteSetor: Setor.mutation.delete,
    addSetor: Setor.mutation.create,
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