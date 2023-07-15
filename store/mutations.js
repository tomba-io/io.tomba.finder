// import Cookies from 'js-cookie'
export default {
  setKey(state, key) {
    state.key = key
  },
  setSecret(state, secret) {
    state.secret = secret
  },
  setAccount(state, account) {
    state.account = account
  },
  setDomains(state, domains) {
    state.domains = domains
  },
  addDomains(state, data) {
    state.domains.push(data)
  },
  loadJSON(state, json) {
    state.domains = JSON.parse(json)
  },
}
