const { getN1, get1N } = require('../fn/related');
const { haveThese } = require('../fn/args')
const season = require('../fn/season');
module.exports = db => ({
  /**
   * Métodos para recuperar instância(s)
   */
  query: {
    byId: (_, { id }) => db.Usuario.findById(id),
    all: (_, { filter }) => db.Usuario.findAll(filter ? { filter } : {})
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
  },
  /**
   * Métodos para alterações em instâncias
   */
  mutation: {
    /**
     * CREATE Usuario
     * @argument {Object} context
     * @argument {Object} args guid:String, matricula:String,\
     * nome!:String, senha:String, permissoes!:Number,\
     * setor:Number, coordenadoria:Number
     * @returns {Object} Created Usuario instance
     */
    create: (_, args) => {
      let { haveThese } = require('../fn/args')
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
    },
    /**
     * DELETE Usuario where usuario.id = id
     * @argument {Object} Parameters {**id**: reference id of user to delete}
     * @returns {Number} Deleted Usuario id or zero in failure
     */
    delete: (_, { id }) => db.Meta.findById(id)
      .then(usr => usr.destroy())
      .then(() => id)
      .catch(() => 0),
    /**
     * UPDATE Usuario set password=newPassword where id=id AND password=olsPassword
     * @argument {Object} context
     * @argument {Object} args id!:Int, 
     */
    changePassword: (_, { id, oldPassword, newPassword }) => {
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
});
