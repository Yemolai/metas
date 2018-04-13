const { getNonNullLastValue, getLastValue, getSubSumOrLastValue, getSubSumOrNonNullLastValue } = require('../fn/getLast');
const { getN1, get1N } = require('../fn/related');

module.exports = db => ({
  def: `type Meta {
    id: ID!
    titulo: String!
    resumo: String
    estado: String
    atualizado: Date
    escopo_previsto: Float
    escopo_realizado: Float
    inicio_previsto: Date
    inicio_realizado: Date
    fim_previsto: Date
    fim_realizado: Date
    custo_previsto: Float
    custo_realizado: Float
    pai: Meta
    responsavel: Usuario
    coordenadoria: Coordenadoria
    autor: Usuario
    submetas: [Meta!]
    atualizacoes: [Atualizacao]
    createdAt: Date
    updatedAt: Date
  }`,
  /**
   * Métodos para recuperar instância(s)
   */
  Query: {
    meta: {
      def: `meta(id: ID!): Meta`,
      resolver: (_, { id }) => db.Meta.findById(id)
    }
  },
  /**
   * Métodos para alterações em instâncias
   */
  Mutation: {
    deleteMeta: {
      def: `deleteMeta(id: ID!): Int`,
      resolver: (_, { id }) => db.Meta.findById(id)
        .then(meta => meta.destroy())
        .then(() => id)
        .catch(() => 0)
    },
    addMeta: {
      def: `addMeta(
        titulo: String!,
        escopo_previsto: Float,
        inicio_previsto: Date,
        fim_previsto: Date,
        custo_previsto: Float,
        pai: Int,
        responsavel: Int,
        coordenadoria: Int,
        autor: Int
      ): Meta`,
      resolver: (_, args) => {
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
      }
    }
  },
  /**
   * Métodos para resolver campos virtuais
   */
  computed: {
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
  }
})