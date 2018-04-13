const { getN1, get1N } = require('../fn/related')
module.exports = db => ({
  def: `type Atualizacao {
    id: ID!
    motivo: String
    titulo: String
    resumo: String
    estado: String
    escopo_previsto: Float
    escopo_realizado: Float
    inicio_previsto: Date
    inicio_realizado: Date
    fim_previsto: Date
    fim_realizado: Date
    custo_previsto: Float
    custo_realizado: Float
    autor: Usuario
    meta: Meta!
    responsavel: Usuario
    pai: Meta
    coordenadoria: Coordenadoria
    createdAt: Date
  }`,
  /**
   * Métodos para resolver campos virtuais
   */
  computed: {
    meta: getN1(db.Meta, 'meta'),
    pai: getN1(db.Meta, 'pai'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    coordenadoria: getN1(db.Coordenadoria, 'coordenadoria'),
    autor: getN1(db.Usuario, 'autor')
  },
  /**
   * Métodos para recuperar instância(s)
   */
  Query: {
    atualizacoes: {
      def: `atualizacoes(filter: Obj): [Atualizacao]`,
      resolver: _ => db.Atualizacao.findAll()
    }
  },
  /**
   * Métodos para alterações em instâncias
   */
  Mutation: {
    deleteAtualizacao: {
      def: `deleteAtualizacao(id: ID!): Int`,
      resolver: (_, { id }) => db.Atualizacao.findById(id)
        .then(atualizacao => atualizacao.destroy())
        .then(() => id)
        .catch(() => 0)
      },
    addAtualizacao: {
      def: `addAtualizacao(
        titulo: String,
        resumo: String,
        motivo: String,
        estado: String,
        escopo_previsto: Float,
        escopo_realizado: Float,
        inicio_previsto: Date,
        inicio_realizado: Date,
        fim_previsto: Date,
        fim_realizado: Date,
        custo_previsto: Float,
        custo_realizado: Float,
        autor: Int,
        meta: Int,
        responsavel: Int,
        pai: Int,
        coordenadoria: Int
      ): Atualizacao`,
      resolver: (_, args) => db.Atualizacao.create({
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
    }
  }
})