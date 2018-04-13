module.exports = db => ({
  def: `type Permissao {
    id: ID!
    nome: String!
    setor_create: Boolean!
    setor_read: Boolean!
    setor_update: Boolean!
    setor_delete: Boolean!
    coord_create: Boolean!
    coord_read: Boolean!
    coord_update: Boolean!
    coord_delete: Boolean!
    meta_create: Boolean!
    meta_read: Boolean!
    meta_update: Boolean!
    meta_delete: Boolean!
    atual_create: Boolean!
    atual_read: Boolean!
    atual_update: Boolean!
    atual_delete: Boolean!
    own_setor_update: Boolean!
    own_setor_delete: Boolean!
    own_coord_update: Boolean!
    own_coord_delete: Boolean!
    own_meta_update: Boolean!
    own_meta_delete: Boolean!
    own_atual_update: Boolean!
    own_atual_delete: Boolean!
  }`,
  /**
   * Métodos para recuperar instância(s)
   */
  Query: {
    permissoes: {
      def: `permissoes: [Permissao!]`,
      resolver: (_, { filter }) => db.Permissao.findAll(filter ? { filter } : {})
    },
    permissao: {
      def: `permissao(id: ID!): Permissao`,
      resolver: (_, { id }) => db.Permissao.findById(id)
    }
  },
  /**
   * Métodos para alterações em instâncias
   */
  Mutation: {
    deletePermissao: {
      def: `deletePermissao(id: ID!): Int`,
      resolver: (root, args) => db.Permissao.findById(args.id)
        .then(permissao => permissao.destroy())
        .then(() => args.id)
        .catch(() => 0)
    },
    addPermissao: {
      def: `addPermissao(
        nome: String!,
        setor_create: Boolean, 
        setor_read: Boolean, 
        setor_update: Boolean, 
        setor_delete: Boolean, 
        coord_create: Boolean, 
        coord_read: Boolean, 
        coord_update: Boolean, 
        coord_delete: Boolean, 
        meta_create: Boolean, 
        meta_read: Boolean, 
        meta_update: Boolean, 
        meta_delete: Boolean, 
        atual_create: Boolean, 
        atual_read: Boolean, 
        atual_update: Boolean, 
        atual_delete: Boolean, 
        own_setor_update: Boolean, 
        own_setor_delete: Boolean, 
        own_coord_update: Boolean, 
        own_coord_delete: Boolean, 
        own_meta_update: Boolean, 
        own_meta_delete: Boolean,
        own_atual_update: Boolean,
        own_atual_delete: Boolean
      ): Permissao`,
      resolver: (_, args) => db.Permissao.create({
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
    }
  }
})