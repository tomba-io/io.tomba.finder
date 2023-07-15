// import Cookies from 'js-cookie'
export default {
  key: (state) => state.key,
  secret: (state) => state.secret,
  account: (state) => state.account,
  domains: (state) => state.domains,
  toJSON(state) {
    return JSON.stringify(state.domains)
  },
}
