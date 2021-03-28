/* eslint-disable no-console */
// atm - auth token manager
export default function ({ $axios, $cookiz }, inject) {
  const atm = {}

  atm.getToken = function () {
    return $cookiz.get('access_token')
  }

  atm.hasToken = function () {
    return !!this.getToken()
  }

  atm._setTokenToHeader = function (token) {
    $axios.interceptors.request.use(function (config) {
      config.headers.Authorization = 'Bearer ' + token
      return config
    }, function (err) {
      return Promise.reject(err)
    })
  }

  atm.setToken = function (tokenData) {
    if (typeof tokenData !== 'object') {
      console.error('Given argument is not an object.')
      return false
    }
    // console.log('Trying to save token', tokenData)

    if (tokenData.access_token && tokenData.expires_in) {
      // console.log('Saving token', tokenData)
      try {
        $cookiz.set(
          'access_token',
          tokenData.access_token,
          {
            expires: new Date(tokenData.expires_in),
            path: '/'
          }
        )
        // console.log('Looks like success', $cookiz.get('access_token'))
      } catch (err) {
        throw new Error(err)
      }

      this._setTokenToHeader(tokenData.access_token)
      return true
    } else {
      console.error('Given argument is not in token object type.')
      return false
    }
  }

  atm.purge = function () {
    $cookiz.remove('access_token')
    this._setTokenToHeader('')
  }

  atm.init = function () {
    if (this.hasToken()) {
      this._setTokenToHeader(this.getToken())
      // console.log('atm debug', this.getToken())
      return true
    } else {
      return false
    }
  }

  atm.init()

  inject('atm', atm)
}
