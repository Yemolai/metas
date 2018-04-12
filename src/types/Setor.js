const { getN1, get1N } = require('../fn/related')
module.exports = db => ({
  /**
   * Métodos para recuperar instância(s)
   */
  query: {
    byId: v => v,
    all: v => v
  },
  /**
   * Métodos para resolver campos virtuais
   */
  computed: {
    autor: getN1(db.Usuario, 'autor'),
    responsavel: getN1(db.Usuario, 'responsavel'),
    coordenadorias: get1N(db.Coordenadoria,'setor')
  },
  /**
   * Métodos para alterações em instâncias
   */
  mutation: {
    delete: (_, { id }) => db.Setor.findById(id)
        .then(setor => setor.destroy())
        .then(() => id)
        .catch(() => 0),
    create: (_, args) => {
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
})