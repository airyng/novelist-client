/* eslint-disable no-console */
// atm - auth token manager
export default function ({ $axios, $cookiz }, inject) {
  const atm = {}

  atm.getToken = function (tokenType = 'access') { // tokenTypes: access, refresh
    return $cookiz.get(tokenType + '_token')
  }

  atm.hasToken = function (tokenType = 'access') { // tokenTypes: access, refresh
    return !!this.getToken(tokenType)
  }

  atm._setTokenToHeader = function (token) {
    // Remove previous interceptors
    if ($axios.interceptors.request.handlers.length) {
      $axios.interceptors.request.handlers = []
    }
    if (token) {
      $axios.interceptors.request.use((config) => {
        config.headers.Authorization = 'Bearer ' + token
        return config
      }, function (err) {
        return Promise.reject(err)
      })
    }
  }

  atm.setToken = function (tokenData) {
    if (typeof tokenData !== 'object') {
      console.error('Given argument is not an object.')
      return false
    }
    if (!tokenData.accessToken || !tokenData.refreshToken) {
      console.error('Given argument is not in token object type.')
      return false
    }

    $cookiz.set('access_token', tokenData.accessToken, { path: '/' })
    $cookiz.set('refresh_token', tokenData.refreshToken, { path: '/' })

    this._setTokenToHeader(tokenData.accessToken)
    return true
  }

  atm.purge = function () {
    $cookiz.remove('access_token')
    $cookiz.remove('refresh_token')
    this._setTokenToHeader(null)
  }

  atm.init = function () {
    if (!this.hasToken()) { return false }
    this._setTokenToHeader(this.getToken())
    return true
  }

  atm.init()

  inject('atm', atm)
}
