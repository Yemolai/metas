const { getN1, get1N } = require('../fn/related')
module.exports = db => ({
  def: `type Setor {
    id: ID!
    nome: String! @unique
    sigla: String! @unique
    endereco: String
    telefone: String
    ramal: String
    responsavel: Usuario
    autor: Usuario
    coordenadorias: [Coordenadoria!]
  }`,
  /**
   * Métodos para recuperar instância(s)
   */
  Query: {
    setores: {
      def: `setores: [Setor!]`,
      resolver: (_, { filter }) => db.Setor.findAll()
    },
    setor: {
      def: `setor(id: ID!): Setor`,
      resolver: (_, { id }) => db.Setor.findById(id)
    }
  },
  /**
   * Métodos para alterações em instâncias
   */
  Mutation: {
    deleteSetor: {
      def: `deleteSetor(id: ID!): Int`,
      resolver: (_, { id }) => db.Setor.findById(id)
        .then(setor => setor.destroy())
        .then(() => id)
        .catch(() => 0)
    },
    addSetor: {
      def: `addSetor(
        sigla: String!,
        nome: String!,
        endereco: String,
        telefone: String,
        ramal: String,
        responsavel: Int,
        autor: Int
      ): Setor`,
      resolver: (_, args) => {
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
      }
    }
  },
  /**
   * Métodos para resolver campos virtuais
   */
  computed: {
    autor: getN1(db.Usuario, 'autor'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    coordenadorias: get1N(db.Coordenadoria,'setor')
  }
})
