module.exports = args => {
  const have = name => name in args
  const haveThese = l => l.reduce((p, a) => p && have(a), true)
  return { have, haveThese }
}