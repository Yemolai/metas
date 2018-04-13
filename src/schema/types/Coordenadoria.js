const { getN1 } = require('../fn/related');

const isNumber = value =>!isNaN(Number(value));

module.exports = db => ({
  def: `type Coordenadoria {
    id: ID!
    nome: String! @unique
    sigla: String! @unique
    endereco: String
    telefone: String
    ramal: String
    setor: Setor
    responsavel: Usuario
    autor: Usuario
    metas(
      submetas: Boolean,
      limit: Int,
      offset: Int
    ): [Meta!]
  }`,
  /**
   * Métodos para recuperar instância(s)
   */
  Query: {
    coordenadoria: {
      def: `coordenadoria(id: ID!): Coordenadoria`,
      resolver: (_, { id }) => db.Coordenadoria.findById(id)
    }
  },
  /**
   * Métodos para alterações em instâncias
   */
  Mutation: {
    addCoordenadoria: {
      def: `addCoordenadoria(
        nome: String!,
        sigla: String!,
        endereco: String,
        telefone: String,
        ramal: String,
        setor: Int!,
        responsavel: Int,
        autor: Int,
      ): Coordenadoria`,
      resolver: (_, args) => {
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
      }
    },
    deleteCoordenadoria: {
      def: `deleteCoordenadoria(id: ID!): Int`,
      resolver: (_, { id }) => db.Coordenadoria.findById(id)
        .then(coord => coord.destroy())
        .then(() => id)
        .catch(() => 0)
    }
  },
  /**
   * Métodos para resolver campos virtuais
   */
  computed: {
    setor: getN1(db.Setor, 'setor'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    autor: getN1(db.Usuario, 'autor'),
    metas: (_, { submetas, limit, offset }) => {
      let conditions = {
        where: { coordenadoria: _.id },
        limit: isNumber(limit) ? limit : 100,
        offset: isNumber(offset) ? offset : 0
      };
      if (submetas === false) {
        conditions.where['pai'] = { [Op.eq]: null };
      }
      if (!isNaN(Number(limit))) {
        conditions['limit'] = limit;
      }
      if (!isNaN(Number(offset))) {
        conditions['offset'] = offset;
      }
      return db.Meta.findAll(conditions);
    }
  }
})