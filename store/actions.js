export default {
  setKey({
    commit
  }, input) {
    commit('setKey', input)
  },
  setSecret({
    commit
  }, input) {
    commit('setSecret', input)
  },
  setAccount({
    commit
  }, input) {
    commit('setAccount', input)
  },
  setDomains({
    commit
  }, input) {
    commit('setDomains', input)
  },
}
