module.exports = {
  up: q => q.bulkInsert('atualizacoes', [
    {
      meta: 1,
      resumo: 'Expansão do escopo e prazo e atualização de estado',
      estado: 'Ao infinito e além, blabla blah blablabla blabla blah blablabla',
      escopo_previsto: 280.0,
      escopo_realizado: 15.0,
      inicio_previsto: new Date('2018-02-01'),
      inicio_realizado: new Date('2018-02-03'),
      fim_previsto: new Date('2018-03-04'),
      custo_previsto: 3581.15,
      custo_realizado: 158.65
    }, {
      meta: 1,
      resumo: 'Segunda atualização e correções',
      escopo_previsto: 285.0,
      escopo_realizado: 16.0,
      fim_previsto: new Date('2018-03-05'),
      custo_realizado: 159.0
    }
  ]),
  down: q => q.bulkDelete('atualizacoes', null)
};
