const { getN1, get1N } = require('../fn/related');
const { haveThese } = require('../fn/args')
const season = require('../fn/season');
module.exports = db => ({
  def: `type Usuario {
    id: ID!
    guid: String
    matricula: String
    nome: String!
    usuario: String
    senha: String
    permissoes: Permissao!
    setor: Setor
    coordenadoria: Coordenadoria
    responsabilidade: [Meta]
  }`,
  /**
   * Métodos para recuperar instância(s)
   */
  Query: {
    usuario: {
      def: `usuario(id: ID!): Usuario`,
      resolver: (_, { id }) => db.Usuario.findById(id)
    },
    usuarios: {
      def: `usuarios: [Usuario!]`,
      resolver: (_, { filter }) => db.Usuario.findAll(filter ? { filter } : {})
    }
  },
  /**
   * Métodos para alterações em instâncias
   */
  Mutation: {
    addUsuario: {
      def: `addUsuario(
        guid: String,
        matricula: String,
        nome: String!,
        usuario: String!,
        senha: String,
        permissoes: Int!,
        setor: Int,
        coordenadoria: Int
      ): Usuario`,
      resolver: (_, args) => {
        const { haveThese } = require('../fn/args')
        if (!(haveThese(['usuario', 'nome', 'permissoes']))) {
          return null;
        }
        return db.Usuario.create({
          guid: args.guid || null,
          matricula: args.matricula || null,
          nome: args.nome,
          usuario: args.usuario,
          senha: season(args.senha) || null,
          permissoes: args.permissoes,
          setor: args.setor || null,
          coordenadoria: args.coordenadoria || null
        })
      }
    },
    deleteUsuario: {
      def: `deleteUsuario(id: ID!): Int`,
      resolver: (_, { id }) => db.Meta.findById(id)
        .then(usr => usr.destroy())
        .then(() => id)
        .catch(() => 0)
    },
    changePassword: {
      def: `changePassword(id: ID!, oldPassword: String, newPassword: String!): Boolean`,
      resolver: (_, { id, oldPassword, newPassword }) => {
        return db.Usuario.findById(id)
          .then(usuario => {
            if (season(oldPassword) === usuario.senha) {
              return usuario.update({
                senha: season(newPassword)
              })
                .then(() => true)
                .catch(() => false)
            }
            return false
          })
      }
    }
  },
  /**
   * Métodos para resolver campos virtuais
   */
  computed: {
    senha: v => v.senha === null ? null : true,
    permissoes: getN1(db.Permissao, 'permissoes'),
    setor: getN1(db.Setor, 'setor'),
    coordenadoria: getN1(db.Setor, 'coordenadoria'),
    responsabilidade: get1N(db.Meta, 'responsavel')
  }
});
